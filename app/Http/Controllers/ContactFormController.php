<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;

class ContactFormController extends Controller
{
    public function submit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => [
                'required',
                'string',
                'max:100',
            ],
            'last_name' => [
                'required',
                'string',
                'max:100',
            ],
            'mobile_number' => [
                'required',
                'digits_between:10,15',
            ],
            'email_address' => [
                'required',
                'email',
            ],
            'additional_information' => [
                'required',
                'min:10',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Save Statamic Submission
        |--------------------------------------------------------------------------
        */

        $form = Form::find('contact_form');

        $submission = $form
            ->makeSubmission()
            ->data($request->except('_token'));

        $submission->save();

        return response()->json([
            'status' => true,
            'message' => 'Thank you! Your message has been sent successfully.',
        ]);
    }
}
