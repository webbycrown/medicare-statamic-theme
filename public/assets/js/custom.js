$(document).ready(function () {
    /*======================================
    Preloader js
    ========================================*/
    (function ($) {
        courses = {
            init: function () {
                this.Preloader_js();
            },
            Preloader_js: function () {
                //After 2s preloader is fadeOut
                $(".preloader").delay(2000).fadeOut("slow");
                setTimeout(function () {
                    //After 2s, the no-scroll class of the body will be removed
                    $("body").removeClass("no-scroll");
                }, 2000); //Here you can change preloader time
            },
        };
        courses.init();
    })(jQuery);
    /*=====================================
    Header sticky
    =======================================*/
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $("header").addClass("sticky");
        } else {
            $("header").removeClass("sticky");
        }
    });

    /*=====================================
    Mobile menu
    =======================================*/
    $("body").on(
        "click",
        ".header-button .toggle-menu, .mobile-menu-close a, .menu li a",
        function () {
            $(".mobile-menu").toggleClass("open");
            $(this).toggleClass("active");
            $("body, html").toggleClass("menu-open");
        },
    );

    /*=====================================
    Mobile menu dropdown
    =======================================*/
    if ($(window).width() <= 991) {
        $(".mobile-menu .menu li").each(function (i) {
            if ($(this).has("ul").length) {
                $(this).find("ul").addClass("sub-menu");
                $(this).find("> a").after('<span class="caret-arrow"></span>');
            }
        });
        $(".mobile-menu .menu li .caret-arrow").click(function () {
            var catSubUl = $(this).next(".sub-menu");
            var catSubli = $(this).closest("li");
            if (catSubUl.is(":hidden")) {
                catSubUl.slideDown();
                $(this).addClass("active");
                catSubli.addClass("active");
            } else {
                catSubUl.slideUp();
                $(this).removeClass("active");
                catSubli.removeClass("active");
            }
        });
    }

    /*=====================================
    Hero section
    =======================================*/
    var swiper = new Swiper(".hero-banner-section .swiper", {
        slidesPerView: 1,
        autoplay: true,
        speed: 2500,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
    });

    /*=====================================
    youtube video section
    =======================================*/
    $(document).ready(function () {
        $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
            disableOn: 700,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
        });
    });

    /*=====================================
    testimonial section
    =======================================*/
    var swiper = new Swiper(".testimonial-slider .swiper", {
        slidesPerView: 1,
        loop: true,
        centeredSlides: true,
        pagination: {
            el: ".testimonial-slider .swiper-pagination",
            clickable: true,
        },
    });

    /*=====================================
    accordion section
    =======================================*/
    const items = document.querySelectorAll(".accordion button");

    function toggleAccordion() {
        const itemToggle = this.getAttribute("aria-expanded");

        for (i = 0; i < items.length; i++) {
            items[i].setAttribute("aria-expanded", "false");
        }

        if (itemToggle == "false") {
            this.setAttribute("aria-expanded", "true");
        }
    }

    items.forEach((item) => item.addEventListener("click", toggleAccordion));

    if (typeof AOS !== "undefined") {
        AOS.init({
            once: true,
        });
    }

    // for service numbering
    updateServiceNumbers();
});

/*=====================================
            Contact form
=======================================*/

$(document).on("submit", "#contact-form", function (e) {
    e.preventDefault();

    let form = this;
    let submitBtn = $(form).find('input[type="submit"]');

    $(".field-error").html("");

    $.ajax({
        url: $(form).attr("action"),
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",

        beforeSend: function () {
            submitBtn.prop("disabled", true);
        },

        success: function (response) {
            $("#form-success").removeClass("hidden").html(response.message);

            form.reset();

            setTimeout(function () {
                $("#form-success").addClass("hidden").html("");
            }, 3000);
        },

        error: function (xhr) {
            $(".field-error").html("");

            if (xhr.status === 422) {
                $.each(xhr.responseJSON.errors, function (field, messages) {
                    $('[data-error-for="' + field + '"]').html(messages[0]);
                });
            }
        },

        complete: function () {
            submitBtn.prop("disabled", false);
        },
    });
});

/*=====================================
            Get in touch form
=======================================*/
$(document).on("submit", "#get-in-touch-form", function (e) {
    e.preventDefault();

    let form = this;
    let submitBtn = $(form).find('input[type="submit"]');

    $(".field-error").html("");

    $.ajax({
        url: $(form).attr("action"),
        type: "POST",
        data: new FormData(form),
        processData: false,
        contentType: false,
        dataType: "json",

        beforeSend: function () {
            submitBtn.prop("disabled", true);
        },

        success: function (response) {
            $("#form-success").removeClass("hidden").html(response.message);

            form.reset();

            setTimeout(function () {
                $("#form-success").addClass("hidden").html("");
            }, 3000);
        },

        error: function (xhr) {
            $(".field-error").html("");

            if (xhr.status === 422) {
                $.each(xhr.responseJSON.errors, function (field, messages) {
                    $('[data-error-for="' + field + '"]').html(messages[0]);
                });
            }
        },

        complete: function () {
            submitBtn.prop("disabled", false);
        },
    });
});

/*=====================================
            Load More data
=======================================*/
$(document).on("click", ".load-more-btn", function (e) {
    e.preventDefault();
    let button = $(this);
    let nextPage = button.data("next-page");
    let wrapper = $(".load-more-wrapper");
    button.prop("disabled", true);
    button.find(".load-more-spinner").show();

    $.ajax({
        url: nextPage,
        type: "GET",
        success: function (response) {
            let html = $(response).find(".load-more-item");
            wrapper.append(html);
            updateServiceNumbers();
            let newButton = $(response).find(".load-more-btn");
            if (newButton.length) {
                button.data("next-page", newButton.data("next-page"));
            } else {
                button.fadeOut();
            }
        },
        complete: function () {
            button.prop("disabled", false);
            button.find(".load-more-text").show();
            button.find(".load-more-spinner").hide();
        },
    });
});

function updateServiceNumbers() {
    $(".wc-services-section .load-more-item").each(function (i) {
        let number = (i + 1).toString().padStart(2, "0");
        $(this).find(".service-number").text(number);
    });
}

/*=====================================
            Appointment Form
=======================================*/
$(document).on("change", "#specialization", function () {
    let specialization = $(this).val();
    let doctorDropdown = $("#doctor_name");
    doctorDropdown.html('<option value="">Loading...</option>');
    $.ajax({
        url: "/get-doctors/" + specialization,
        type: "GET",
        success: function (response) {
            doctorDropdown.html('<option value="">Select Doctor</option>');

            $.each(response, function (index, doctor) {
                doctorDropdown.append(
                    `<option value="${doctor.id}">
                        ${doctor.title}
                    </option>`,
                );
            });
        },
    });
});

$(document).on("submit", "#appointment-form", function (e) {
    e.preventDefault();

    let form = $(this);
    $(".field-error").html("");
    $("#form-success").addClass("hidden").html("");
    $.ajax({
        url: form.attr("action"),
        method: "POST",
        data: form.serialize(),
        success: function (response) {
            $("#form-success").removeClass("hidden").html(response.message);
            setTimeout(function () {
                form[0].reset();
                // $("#form-success").css({ display: "none" });
            }, 3000);
            $("#doctor_name").html('<option value="">Select Doctor</option>');
        },
        error: function (xhr) {
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                $.each(errors, function (field, message) {
                    $(`[data-error-for="${field}"]`).html(message[0]);
                });
            }
        },
    });
});

/*=====================================
            Newsletter Form
=======================================*/

$(document).on("submit", "#newsletter-form", function (e) {
    e.preventDefault();

    let form = $(this);
    $(".field-error").html("");
    $("#news-form-success").addClass("hidden").html("");
    $.ajax({
        url: form.attr("action"),
        method: "POST",
        data: form.serialize(),
        success: function (response) {
            $("#form-success").removeClass("hidden").html(response.message);
            setTimeout(function () {
                form[0].reset();
                $("#form-success").css({ display: "none" });
            }, 3000);
        },
        error: function (xhr) {
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                $.each(errors, function (field, message) {
                    $(`[data-error-for="${field}"]`).html(message[0]);
                });
            }
        },
    });
});

/*=====================================
            Reservation Form
=======================================*/

$(document).on("submit", "#reservation-form", function (e) {
    e.preventDefault();

    let form = $(this);
    $(".field-error").html("");
    $("#news-form-success").addClass("hidden").html("");
    $.ajax({
        url: form.attr("action"),
        method: "POST",
        data: form.serialize(),
        success: function (response) {
            $("#form-success").removeClass("hidden").html(response.message);
            setTimeout(function () {
                form[0].reset();
                $("#form-success").css({ display: "none" });
            }, 3000);
        },
        error: function (xhr) {
            if (xhr.status === 422) {
                let errors = xhr.responseJSON.errors;
                $.each(errors, function (field, message) {
                    $(`[data-error-for="${field}"]`).html(message[0]);
                });
            }
        },
    });
});

/*=====================================
    Blog Filter
=======================================*/

if (window.currentPage && window.currentPage.toLowerCase() == "blog") {
    const params = new URLSearchParams(window.location.search);
    const searchValue = params.get("s") || "";
    const tag = params.get("tag") || "";
    if (searchValue || tag) {
        $.ajax({
            url: "/blog/filter",
            type: "GET",
            data: {
                q: searchValue,
                tag: tag,
            },
            beforeSend: function () {
                $(".blog_search").html(`
                    <div class="text-center w-100">
                        <p>Loading blogs...</p>
                    </div>
                `);
            },
            success: function (response) {
                $(".blog_search").html(response.html);
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                $(".blog_search").html(`
                    <div class="grid-item">
                        <p class="text-danger text-center">
                            Something went wrong.
                        </p>
                    </div>
                `);
            },
        });
    }
}

$(document).on("submit", "#comment-form", function (e) {
    e.preventDefault();

    const $form = $(this);
    const $button = $form.find("#comment-submit");
    const originalText = $button.text();

    /*
    |--------------------------------------------------------------------------
    | Clear previous errors
    |--------------------------------------------------------------------------
    */

    $form.find(".field-error").text("");

    $("#form-success")
        .addClass("hidden")
        .removeClass("text-danger text-success")
        .text("");

    /*
    |--------------------------------------------------------------------------
    | Disable button
    |--------------------------------------------------------------------------
    */

    $button.prop("disabled", true).text("Submitting...");

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    $.ajax({
        url: $form.attr("action"),
        type: "POST",
        data: $form.serialize(),

        success: function (response) {
            if (!response.status) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Show success
            |--------------------------------------------------------------------------
            */

            $("#form-success")
                .removeClass("hidden")
                .addClass("text-success")
                .text(response.message);

            /*
            |--------------------------------------------------------------------------
            | Reset form
            |--------------------------------------------------------------------------
            */

            $form[0].reset();

            /*
            |--------------------------------------------------------------------------
            | Important:
            | Keep blog_id but reset parent_id.
            |--------------------------------------------------------------------------
            */

            const blogId = $form.find('[name="blog_id"]').val();

            $form.find('[name="blog_id"]').val(blogId);
            $form.find('[name="parent_id"]').val("");

            /*
            |--------------------------------------------------------------------------
            | Reload comments
            |--------------------------------------------------------------------------
            */

            if (typeof loadComments === "function") {
                loadComments(blogId);
            }
        },

        error: function (xhr) {
            /*
            |--------------------------------------------------------------------------
            | Validation error
            |--------------------------------------------------------------------------
            */

            if (xhr.status === 422) {
                const response = xhr.responseJSON;

                if (response && response.errors) {
                    $.each(response.errors, function (field, messages) {
                        const message = messages[0];

                        $form
                            .find('[data-error-for="' + field + '"]')
                            .text(message);
                    });
                }

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Other error
            |--------------------------------------------------------------------------
            */

            const message =
                xhr.responseJSON?.message ||
                "Something went wrong. Please try again.";

            $("#form-success")
                .removeClass("hidden")
                .addClass("text-danger mb-3")
                .text(message);
        },

        complete: function () {
            $button.prop("disabled", false).text(originalText);
        },
    });
});

function loadComments(blogId) {
    const $commentsList = $("#comments-list");

    if (!$commentsList.length) {
        return;
    }

    $.ajax({
        url: "/comments/" + encodeURIComponent(blogId),
        type: "GET",
        success: function (response) {
            if (!response.status) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Clear existing comments
            |--------------------------------------------------------------------------
            */
            $commentsList.empty();

            /*
            |--------------------------------------------------------------------------
            | No comments
            |--------------------------------------------------------------------------
            */
            if (!response.comments.length) {
                $commentsList.html(
                    '<p class="no-comments">No comments yet.</p>',
                );
                return;
            }
            /*
            |--------------------------------------------------------------------------
            | Render comments
            |--------------------------------------------------------------------------
            */
            let html = `
                <h3 class="comment-title">Comments</h3>
            `;
            response.comments.forEach(function (comment) {
                html += `
                    <ul
                        class="comment-item comment-items"
                        data-comment-id="${comment.id}"
                    >
                        <li class="single-comment">

                            <h4 class="comment-author">
                                <strong>${comment.name}</strong>
                            </h4>

                            <p class="comment-text">
                                ${comment.additional_information}
                            </p>

                        </li>
                    </ul>
                `;
            });

            /*
            |--------------------------------------------------------------------------
            | Append ONCE
            |--------------------------------------------------------------------------
            */

            $commentsList.html(html);

            /*
            |--------------------------------------------------------------------------
            | Initialize Comment Load More
            |--------------------------------------------------------------------------
            */

            initCommentLoadMore();
        },
        error: function (xhr) {
            console.error("Failed to load comments:", xhr);
        },
    });
}

$(document).ready(function () {
    loadCommentCounts();
    const path = window.location.pathname;

    /*
    |--------------------------------------------------------------------------
    | Only run comments on /blog/{id}
    |--------------------------------------------------------------------------
    */

    const parts = path.split("/").filter(Boolean);

    if (parts.length !== 2 || parts[0] !== "blog") {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Get blog ID from comment form
    |--------------------------------------------------------------------------
    */

    const $commentForm = $("#comment-form");

    if (!$commentForm.length) {
        return;
    }

    const blogId = $commentForm.find('input[name="blog_id"]').val();

    /*
    |--------------------------------------------------------------------------
    | Blog ID is required
    |--------------------------------------------------------------------------
    */

    if (!blogId) {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Load comments for current blog
    |--------------------------------------------------------------------------
    */

    loadComments(blogId);
});

function loadCommentCounts() {
    $(".comment-count").each(function () {
        const $count = $(this);

        const blogId = $count.data("blog-id");

        if (!blogId) {
            return;
        }

        $.ajax({
            url: "/comments/" + encodeURIComponent(blogId) + "/count",
            type: "GET",

            success: function (response) {
                if (!response.status) {
                    return;
                }

                $count.text(response.count);
            },

            error: function (xhr) {
                console.error(
                    "Failed to load comment count for blog:",
                    blogId,
                    xhr,
                );

                $count.text("0");
            },
        });
    });
}

/*
|--------------------------------------------------------------------------
| Comment Load More
|--------------------------------------------------------------------------
*/

function initCommentLoadMore() {
    const $commentsList = $("#comments-list");

    if (!$commentsList.length) {
        return;
    }

    const $comments = $commentsList.find("ul.comment-items");

    const initialItems = Number(window.initial_items);


    if (!$comments.length) {
        $(".comment-load-more-btn").hide();
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Hide all comments
    |--------------------------------------------------------------------------
    */

    $comments.hide();

    /*
    |--------------------------------------------------------------------------
    | Show initial comments
    |--------------------------------------------------------------------------
    */

    $comments.slice(0, initialItems).show();

    /*
    |--------------------------------------------------------------------------
    | Load More button
    |--------------------------------------------------------------------------
    */

    const $button = $(".comment-load-more-btn");

    if ($comments.length <= initialItems) {
        $button.hide();
        return;
    }

    $button.show();

    /*
    |--------------------------------------------------------------------------
    | Store visible count
    |--------------------------------------------------------------------------
    */

    $button.data("visible-items", initialItems);

    /*
    |--------------------------------------------------------------------------
    | Remove previous handler
    |--------------------------------------------------------------------------
    */

    $button.off("click.commentLoadMore");

    /*
    |--------------------------------------------------------------------------
    | Load More
    |--------------------------------------------------------------------------
    */

    $button.on("click.commentLoadMore", function (e) {
        e.preventDefault();

        const visibleItems = Number($button.data("visible-items"));

        $comments.slice(visibleItems, visibleItems + initialItems).slideDown();

        const newVisibleItems = visibleItems + initialItems;

        $button.data("visible-items", newVisibleItems);

        /*
            |--------------------------------------------------------------------------
            | Hide when all comments are displayed
            |--------------------------------------------------------------------------
            */

        if (newVisibleItems >= $comments.length) {
            $button.fadeOut();
        }
    });
}
