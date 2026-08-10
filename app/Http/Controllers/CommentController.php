<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Statamic\Facades\Form;
use Statamic\Facades\FormSubmission;

class CommentController extends Controller
{
    /**
     * Store a comment/reply in the Statamic comments form.
     */
    public function submit(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Validate request
        |--------------------------------------------------------------------------
        */

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'comment_email' => [
                'required',
                'email',
                'max:255',
            ],

            'website' => [
                'nullable',
                'url',
                'max:255',
            ],

            'additional_information' => [
                'required',
                'string',
                'max:5000',
            ],

            'blog_id' => [
                'required',
                'string',
            ],

            'parent_id' => [
                'nullable',
                'string',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Validation failed
        |--------------------------------------------------------------------------
        */

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors below.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Find Statamic comments form
        |--------------------------------------------------------------------------
        */

        $form = Form::find('comments');

        if (!$form) {
            return response()->json([
                'status' => false,
                'message' => 'Comments form was not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Create submission
        |--------------------------------------------------------------------------
        */

        $submission = $form->makeSubmission();

        $submission->data([
            'name' => $request->input('name'),

            'comment_email' => $request->input('comment_email'),

            'website' => $request->input('website'),

            'additional_information' =>
                $request->input('additional_information'),

            'parent_id' => $request->input('parent_id'),

            'blog_id' => $request->input('blog_id'),
        ]);

        $submission->save();

        /*
        |--------------------------------------------------------------------------
        | Success response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'status' => true,
            'message' => 'Your comment has been submitted successfully.',
            'comment' => [
                'id' => $submission->id(),
                'name' => $submission->get('name'),
                'comment_email' => $submission->get('comment_email'),
                'website' => $submission->get('website'),
                'additional_information' =>
                    $submission->get('additional_information'),
                'parent_id' => $submission->get('parent_id'),
                'blog_id' => $submission->get('blog_id'),
            ],
        ]);
    }
    public function comments(Request $request)
{
    $blogId = $request->route('blog_id');

    if (!$blogId) {
        return response()->json([
            'status' => false,
            'message' => 'Blog ID is required.',
        ], 422);
    }

    $perPage = (int) $request->get(
        'per_page',
        config('app.comments_per_page', 5)
    );

    $comments = FormSubmission::query()
        ->where('form', 'comments')
        ->where('blog_id', $blogId)
        ->orderByDesc('date')
        ->paginate($perPage);

    return response()->json([
        'status' => true,

        'comments' => $comments->getCollection()->map(function ($comment) {
            return [
                'id' => $comment->id(),

                'name' => $comment->get('name'),

                'comment_email' => $comment->get('comment_email'),

                'website' => $comment->get('website'),

                'additional_information' =>
                    $comment->get('additional_information'),

                'parent_id' =>
                    $comment->get('parent_id'),

                'blog_id' =>
                    $comment->get('blog_id'),

                'date' =>
                    $comment->date()?->format('d M, Y h:i A'),
            ];
        })->values(),

        'pagination' => [
            'current_page' => $comments->currentPage(),
            'last_page' => $comments->lastPage(),
            'per_page' => $comments->perPage(),
            'total' => $comments->total(),

            'next_page_url' => $comments->nextPageUrl(),
        ],
    ]);
}

    public function count(string $blog_id)
    {
        $count = FormSubmission::query()
            ->where('form', 'comments')
            ->where('blog_id', $blog_id)
            ->where(function ($query) {
                $query->whereNull('parent_id')
                    ->orWhere('parent_id', '');
            })
            ->count();


        return response()->json([
            'status' => true,
            'count' => $count,
        ]);
    }

}
