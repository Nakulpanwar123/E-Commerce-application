<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$dsn = 'mysql:host=127.0.0.1;port=3306;dbname=fashionstore;charset=utf8mb4';
$pdo = new PDO($dsn, 'root', 'Priy@1309', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);

$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = str_replace('/api', '', $uri);
$method = $_SERVER['REQUEST_METHOD'];
$parts  = explode('/', trim($uri, '/'));
$resource = $parts[0] ?? '';
$id       = $parts[1] ?? null;

function respond($data, $code = 200) { http_response_code($code); echo json_encode($data); exit(); }
function body() { return json_decode(file_get_contents('php://input'), true) ?? []; }

switch ($resource) {

    case 'products':
        if ($method === 'GET' && !$id) {
            $category = $_GET['category'] ?? null;
            $search   = $_GET['search'] ?? null;
            $sort     = $_GET['sort'] ?? 'newest';
            $page     = max(1, (int)($_GET['page'] ?? 1));
            $limit    = 12;
            $offset   = ($page - 1) * $limit;

            $where = ['p.is_active = 1', 'p.stock > 0'];
            $params = [];

            if ($category) { $where[] = 'c.slug = ?'; $params[] = $category; }
            if ($search)   { $where[] = '(p.name LIKE ? OR p.brand LIKE ?)'; $params[] = "%$search%"; $params[] = "%$search%"; }

            $orderBy = match($sort) {
                'price_asc'  => 'p.sale_price ASC',
                'price_desc' => 'p.sale_price DESC',
                'popular'    => 'p.views_count DESC',
                default      => 'p.created_at DESC'
            };

            $whereStr = implode(' AND ', $where);
            $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug,
                    (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as image
                    FROM products p LEFT JOIN categories c ON p.category_id = c.id
                    WHERE $whereStr AND p.deleted_at IS NULL ORDER BY $orderBy LIMIT $limit OFFSET $offset";

            $stmt = $pdo->prepare($sql); $stmt->execute($params);
            $products = $stmt->fetchAll();

            $countStmt = $pdo->prepare("SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE $whereStr AND p.deleted_at IS NULL");
            $countStmt->execute($params);
            $total = $countStmt->fetchColumn();

            respond(['data' => $products, 'total' => $total, 'page' => $page, 'pages' => ceil($total / $limit)]);
        }

        if ($method === 'GET' && $id) {
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? AND p.is_active = 1 AND p.deleted_at IS NULL");
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if (!$product) respond(['error' => 'Not found'], 404);

            $imgStmt = $pdo->prepare("SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order");
            $imgStmt->execute([$product['id']]);
            $product['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

            $varStmt = $pdo->prepare("SELECT * FROM product_variants WHERE product_id = ?");
            $varStmt->execute([$product['id']]);
            $product['variants'] = $varStmt->fetchAll();

            $revStmt = $pdo->prepare("SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? AND r.is_approved = 1 ORDER BY r.created_at DESC LIMIT 10");
            $revStmt->execute([$product['id']]);
            $product['reviews'] = $revStmt->fetchAll();

            $pdo->prepare("UPDATE products SET views_count = views_count + 1 WHERE id = ?")->execute([$product['id']]);
            respond($product);
        }
        break;

    case 'categories':
        $stmt = $pdo->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order");
        respond($stmt->fetchAll());
        break;

    case 'cart':
        session_start();
        $cartKey = 'cart_' . (session_id());

        if ($method === 'GET') {
            $cart = $_SESSION[$cartKey] ?? [];
            $items = [];
            foreach ($cart as $item) {
                $stmt = $pdo->prepare("SELECT p.*, (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1) as image FROM products p WHERE p.id = ?");
                $stmt->execute([$item['product_id']]);
                $product = $stmt->fetch();
                if ($product) $items[] = array_merge($item, ['product' => $product]);
            }
            respond($items);
        }

        if ($method === 'POST') {
            $data = body();
            $cart = $_SESSION[$cartKey] ?? [];
            $found = false;
            foreach ($cart as &$item) {
                if ($item['product_id'] == $data['product_id']) { $item['quantity'] += $data['quantity'] ?? 1; $found = true; break; }
            }
            if (!$found) $cart[] = ['product_id' => $data['product_id'], 'variant_id' => $data['variant_id'] ?? null, 'quantity' => $data['quantity'] ?? 1];
            $_SESSION[$cartKey] = $cart;
            respond(['success' => true, 'count' => array_sum(array_column($cart, 'quantity'))]);
        }

        if ($method === 'DELETE') {
            $cart = $_SESSION[$cartKey] ?? [];
            $productId = $id;
            $_SESSION[$cartKey] = array_values(array_filter($cart, fn($i) => $i['product_id'] != $productId));
            respond(['success' => true]);
        }
        break;

    case 'search':
        $q = $_GET['q'] ?? '';
        if (strlen($q) < 2) respond([]);
        $stmt = $pdo->prepare("SELECT id, name, sale_price, slug, (SELECT url FROM product_images WHERE product_id = products.id LIMIT 1) as image FROM products WHERE (name LIKE ? OR brand LIKE ?) AND is_active = 1 AND stock > 0 LIMIT 6");
        $stmt->execute(["%$q%", "%$q%"]);
        respond($stmt->fetchAll());
        break;

    case 'blogs':
        if ($method === 'GET' && !$id) {
            $stmt = $pdo->query("SELECT id, title, slug, excerpt, cover_image, category, published_at FROM blogs WHERE is_published = 1 ORDER BY published_at DESC LIMIT 10");
            respond($stmt->fetchAll());
        }
        if ($method === 'GET' && $id) {
            $stmt = $pdo->prepare("SELECT b.*, u.name as author_name FROM blogs b JOIN users u ON b.author_id = u.id WHERE b.slug = ? AND b.is_published = 1");
            $stmt->execute([$id]);
            $blog = $stmt->fetch();
            if (!$blog) respond(['error' => 'Not found'], 404);
            respond($blog);
        }
        break;

    case 'register':
        if ($method === 'POST') {
            $data = body();
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            if ($stmt->fetch()) respond(['error' => 'Email already exists'], 422);
            $pdo->prepare("INSERT INTO users (name, email, password, referral_code, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())")
                ->execute([$data['name'], $data['email'], password_hash($data['password'], PASSWORD_BCRYPT), strtoupper(substr(md5(uniqid()), 0, 8))]);
            respond(['success' => true]);
        }
        break;

    case 'login':
        if ($method === 'POST') {
            session_start();
            $data = body();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch();
            if (!$user || !password_verify($data['password'], $user['password'])) respond(['error' => 'Invalid credentials'], 401);
            $token = bin2hex(random_bytes(32));
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['token']   = $token;
            unset($user['password']);
            respond(['user' => $user, 'token' => $token]);
        }
        break;

    case 'orders':
        session_start();
        if ($method === 'POST') {
            $data = body();
            $orderNumber = 'FS-' . strtoupper(uniqid());
            $pdo->prepare("INSERT INTO orders (user_id, order_number, status, payment_method, payment_status, subtotal, discount, shipping, tax, total, shipping_name, shipping_phone, shipping_line1, shipping_city, shipping_state, shipping_pincode, created_at, updated_at) VALUES (?, ?, 'pending', ?, 'pending', ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())")
                ->execute([$data['user_id'] ?? 1, $orderNumber, $data['payment_method'], $data['subtotal'], $data['shipping'], $data['tax'], $data['total'], $data['name'], $data['phone'], $data['line1'], $data['city'], $data['state'], $data['pincode']]);
            $orderId = $pdo->lastInsertId();
            foreach ($data['items'] as $item) {
                $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())")
                    ->execute([$orderId, $item['product_id'], $item['name'], $item['price'], $item['quantity'], $item['price'] * $item['quantity']]);
            }
            respond(['success' => true, 'order_number' => $orderNumber]);
        }
        break;

    default:
        respond(['error' => 'Not found'], 404);
}
