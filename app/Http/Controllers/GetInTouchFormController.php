<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;

class GetInTouchFormController extends Controller
{
    public function submit(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'mobile_number' => [
                'required',
                'digits_between:10,15',
            ],
            'email' => [
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

        $form = Form::find('get_in_touch');

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
