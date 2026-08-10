<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\GetInTouchFormController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\NewsLetterController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);

Route::post('/contact-form', [ContactFormController::class, 'submit'])->name('contact_form.submit');
Route::post('/get-in-touch-form', [GetInTouchFormController::class, 'submit'])->name('reachUs.submit');
Route::get('/get-doctors/{specialization}', [AppointmentController::class, 'getDoctors'])->name('appointment.getDoctors');
Route::post('/appointment-submit', [AppointmentController::class, 'submit'])->name('appointment.submit');
Route::post('/newsletter-form', [NewsLetterController::class, 'submit'])->name('newsletter.submit');
Route::post('/reservation-form', [ReservationController::class, 'submit'])->name('reservation.submit');
Route::get('/blogs/filter', [BlogController::class, 'filter'])->name('blogs.filter');
Route::post('/comment', [CommentController::class, 'submit'])->name('comment.submit');
Route::get('/comments/{blog_id}', [CommentController::class, 'comments'])->name('comments.list');

Route::get(
    '/comments/{blog_id}/count',
    [CommentController::class, 'count']
)->name('comments.count');
