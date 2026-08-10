<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Entry;
use Statamic\Facades\Blink;

class BlogController extends Controller
{
    public function filter(Request $request)
    {
        $tag = $request->tag;
        $search = $request->q;
        $blogs = Entry::query()
            ->where('collection', 'blogs')
            ->where('published', true)
            ->get();
        if ($tag) {
            $tagTitle = str_replace('-', ' ', $tag);
            $tagEntry = Entry::query()
                ->where('collection', 'tags')
                ->get()
                ->first(function ($entry) use ($tagTitle) {
                    return strtolower($entry->title) == strtolower($tagTitle);
                });
            if ($tagEntry) {
                $tagId = $tagEntry->id();
                $blogs = $blogs->filter(function ($blog) use ($tagId) {
                    return in_array(
                        $tagId,
                        $blog->get('tags', [])
                    );
                });
            } else {
                $blogs = collect();
            }
        }
        if ($search) {
            $blogs = $blogs->filter(function ($blog) use ($search) {
                return str_contains(
                    strtolower($blog->title),
                    strtolower($search)
                );
            });
        }
        $html = view('blog-filter', [
            'blogs' => $blogs
        ])->render();
        return response()->json([
            'html' => $html
        ]);
    }
}
