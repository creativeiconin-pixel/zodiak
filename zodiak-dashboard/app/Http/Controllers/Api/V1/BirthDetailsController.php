<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBirthDetailsRequest;
use App\Http\Resources\SeekerResource;

class BirthDetailsController extends Controller
{
    /**
     * Store the seeker's birth coordinates and the headline facts of the chart computed from them.
     */
    public function update(UpdateBirthDetailsRequest $request): SeekerResource
    {
        $birth = $request->validated('birth');

        $request->user()->update([
            'name' => $request->validated('name'),
            'gender' => $request->validated('gender'),
            'birth_date' => $birth['date'],
            'birth_time' => $birth['time_unknown'] ? null : $birth['time'],
            'birth_time_unknown' => $birth['time_unknown'],
            'birth_place' => $birth['place'],
            'birth_latitude' => $birth['latitude'],
            'birth_longitude' => $birth['longitude'],
            'birth_timezone' => $birth['timezone'],
            'chart' => $request->validated('chart'),
        ]);

        return new SeekerResource($request->user());
    }
}
