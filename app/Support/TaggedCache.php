<?php

namespace App\Support;

use BadMethodCallException;
use Closure;
use Illuminate\Support\Facades\Cache;

class TaggedCache
{
    public static function remember(array $tags, string $key, int $ttl, Closure $callback): mixed
    {
        try {
            return Cache::tags($tags)->remember($key, $ttl, $callback);
        } catch (BadMethodCallException) {
            return Cache::remember($key, $ttl, $callback);
        }
    }

    public static function flush(array $tags): bool
    {
        try {
            return Cache::tags($tags)->flush();
        } catch (BadMethodCallException) {
            return Cache::flush();
        }
    }
}
