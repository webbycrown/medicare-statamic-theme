<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;

class NewsLetterController extends Controller
{
    public function submit(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'newsletter_email' => [
                    'required',
                    'email'
                ],
            ],
            [
                'newsletter_email.required' => 'Please enter email address.',
                'newsletter_email.email' => 'Please enter valid email address.',
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

        $form = Form::find('newsletter');
        $submission = $form
            ->makeSubmission()
            ->data($request->all());
        $submission->save();
        return response()->json([
            'status' => true,
            'message' => 'Your request submitted successfully.',
        ]);
    }
}
