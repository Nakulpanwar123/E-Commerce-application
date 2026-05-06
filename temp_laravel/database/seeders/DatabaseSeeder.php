<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@fashionstore.com'],
            [
                'name'          => 'Admin',
                'password'      => Hash::make('Admin@1234'),
                'referral_code' => 'ADMIN001',
            ]
        );
        $admin->assignRole('admin');

        $this->command->info('✅ Roles created: admin, user');
        $this->command->info('✅ Admin user: admin@fashionstore.com / Admin@1234');
    }
}
