@extends('layouts.app')
@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="section-title mb-2">Size Guide</h1>
    <p class="text-gray-500 mb-8">Find your perfect fit with our comprehensive size guide.</p>
    <div class="card overflow-hidden mb-8">
        <div class="p-5 border-b border-gray-100 bg-gray-50"><h2 class="font-semibold">Men's Tops & T-Shirts</h2></div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-center">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase"><tr>
                    @foreach(['Size','Chest (in)','Waist (in)','Hip (in)'] as $h)<th class="px-4 py-3">{{ $h }}</th>@endforeach
                </tr></thead>
                <tbody class="divide-y divide-gray-100">
                    @foreach([['S','34-36','28-30','34-36'],['M','38-40','32-34','38-40'],['L','42-44','36-38','42-44'],['XL','46-48','40-42','46-48'],['XXL','50-52','44-46','50-52']] as $row)
                    <tr class="hover:bg-gray-50">@foreach($row as $cell)<td class="px-4 py-3">{{ $cell }}</td>@endforeach</tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
