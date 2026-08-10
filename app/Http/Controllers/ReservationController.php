<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;
use Statamic\Facades\Submission;

class ReservationController extends Controller
{
    public function submit(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'name' => [
                    'required',
                ],
                'reason_for_appointment' => [
                    'required',
                ],
                'reservation_email' => [
                    'required',
                    'email',
                ],
                'date_field' => [
                    'required',
                    'date'
                ],
                'treatment_type' => [
                    'required',
                ],
            ],
            [
                'name.required' => 'Please enter name.',
                'reason_for_appointment.required' => 'Please enater reason for appointment.',
                'reservation_email.required' => 'Please enter email address.',
                'reservation_email.email' => 'Please enter valid email address.',
                'date_field.required' => 'Please select date.',
                'date_field.date' => 'Please select valid date.',
                'treatment_type.required' => 'Please select treatment_type.',
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

        $form = Form::find('reservation');
        $submission = $form
            ->makeSubmission()
            ->data($request->all());
        $submission->save();
        return response()->json([
            'status' => true,
            'message' => 'reservation submitted successfully.',
        ]);
    }
}
