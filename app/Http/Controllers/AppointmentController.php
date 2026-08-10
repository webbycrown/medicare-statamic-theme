<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;
use Statamic\Facades\Entry;

class AppointmentController extends Controller
{
    public function getDoctors($specialization)
    {
        $doctors = Entry::query()
            ->where('collection', 'team_members')
            ->get()
            ->filter(function ($doctor) use ($specialization) {
                return in_array(
                    $specialization,
                    $doctor->get('specialties', [])
                );
            });

        return response()->json(
            $doctors->map(function ($doctor) {
                return [
                    'id' => $doctor->id(),
                    'title' => $doctor->title,
                ];
            })->values()
        );
    }
    public function submit(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'specialization' => [
                    'required',
                ],
                'doctor_name' => [
                    'required',
                ],
                'enter_date' => [
                    'required',
                    'date',
                ],
                'start_time' => [
                    'required',
                ],
                'end_time' => [
                    'required',
                ],
            ],
            [
                'specialization.required' => 'Please select treatment type.',
                'doctor_name.required' => 'Please select doctor.',
                'enter_date.required' => 'Please select appointment date.',
                'start_time.required' => 'Please select start time.',
                'end_time.required' => 'Please select end time.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        Save Statamic Form Submission
        */

        $form = Form::find('appointment');
        $submission = $form
            ->makeSubmission()
            ->data($request->all());
        $submission->save();
        return response()->json([
            'status' => true,
            'message' => 'Appointment request submitted successfully.',
        ]);
    }
}
