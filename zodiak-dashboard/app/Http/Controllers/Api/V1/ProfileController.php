<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeekerResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): SeekerResource
    {
        return new SeekerResource($request->user());
    }
}
