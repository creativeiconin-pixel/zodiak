<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\RemedyResource;
use App\Models\Remedy;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RemedyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return RemedyResource::collection(Remedy::active()->orderBy('sort_order')->get());
    }

    public function show(Remedy $remedy): RemedyResource
    {
        abort_unless($remedy->is_active, 404);

        return new RemedyResource($remedy);
    }
}
