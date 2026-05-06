<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'phone', 'avatar', 'google_id', 'email_verified_at', 'referral_code', 'referred_by'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function addresses() { return $this->hasMany(Address::class); }
    public function orders()    { return $this->hasMany(Order::class); }
    public function cart()      { return $this->hasMany(Cart::class); }
    public function wishlist()  { return $this->hasMany(Wishlist::class); }
    public function reviews()   { return $this->hasMany(Review::class); }

    public function defaultAddress()
    {
        return $this->hasOne(Address::class)->where('is_default', true);
    }

    public function outfits() { return $this->hasMany(Outfit::class); }

    public function hasRole(string $role): bool
    {
        return false;
    }
}
