@extends('layouts.app')
@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="outfitBuilder()">
    <h1 class="section-title mb-2">Outfit Builder</h1>
    <p class="text-gray-500 mb-8">Mix & match to create your perfect look</p>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {{-- Outfit Preview --}}
        <div class="lg:col-span-1">
            <div class="card p-6 sticky top-24">
                <h2 class="font-semibold mb-4">Your Outfit</h2>
                @foreach(['top' => 'Top','bottom' => 'Bottom','shoes' => 'Shoes','accessory' => 'Accessory'] as $key => $label)
                <div class="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
                    <template x-if="selected.{{ $key }}">
                        <img :src="selected.{{ $key }}.image" :alt="selected.{{ $key }}.name" class="w-12 h-12 object-cover rounded-lg">
                    </template>
                    <template x-if="!selected.{{ $key }}">
                        <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">{{ $label }}</div>
                    </template>
                    <div>
                        <p class="text-xs text-gray-400">{{ $label }}</p>
                        <p class="text-sm font-medium text-gray-700" x-text="selected.{{ $key }}?.name ?? 'Not selected'"></p>
                    </div>
                </div>
                @endforeach
                <button @click="save()" class="btn-primary w-full mt-4">Save Outfit ✨</button>
            </div>
        </div>

        {{-- Product Selectors --}}
        <div class="lg:col-span-2 space-y-8">
            @foreach(['top' => ['Top','tops'],'bottom' => ['Bottom','bottoms'],'shoes' => ['Shoes','shoes'],'accessory' => ['Accessory','accessories']] as $key => [$label,$slug])
            <div>
                <h2 class="font-semibold text-gray-900 mb-4">{{ $label }}</h2>
                <div class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                    @foreach($categories[$key] ?? [] as $product)
                    <button @click="pick('{{ $key }}', { id: {{ $product->id }}, name: '{{ addslashes($product->name) }}', image: '{{ $product->primary_image }}' })"
                        class="flex-shrink-0 w-32 rounded-xl overflow-hidden border-2 transition-all"
                        :class="selected.{{ $key }}?.id === {{ $product->id }} ? 'border-primary-500' : 'border-transparent hover:border-gray-300'">
                        <img src="{{ $product->primary_image }}" alt="{{ $product->name }}" class="w-full aspect-square object-cover">
                        <p class="text-xs text-center p-2 font-medium truncate">{{ $product->name }}</p>
                    </button>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>
@endsection
