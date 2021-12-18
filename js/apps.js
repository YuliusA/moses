/*!
 * Plugin:      Moses jQuery Apps
 * Author:      Yulius Adrianto
 * Version:     1.0
 */
;(function($, win, doc) {
    var isPageLoading	= false,
        coverLoaded		= false,
        newLocation		= '',
        firstLoad		= false;

    var mosClick        = 'mosclick',
        mPages = ['index','experience','wsp','graphene','emirates','wunderman','starbucks','adidas','monalisa'];
    var pages = {
        index: {
            path: 'index.html',
            title: 'Moses is an Art Deyerector',
            color: 'orange'
        },
        experience: {
            path: 'experience.html',
            title: 'Moses Has 9 years Experience',
            color: 'bluegrey'
        },
        wsp: {
            path: 'wsp.html',
            title: 'Moses Designed WSP Future Cities',
            color: 'navy'
        },
        graphene: {
            path: 'graphene.html',
            title: 'Moses for Graphene Institute Interior',
            color: 'red'
        },
        emirates: {
            path: 'emirates.html',
            title: 'Moses Helped Emirates Finds Pilots',
            color: 'blue'
        },
        wunderman: {
            path: 'wunderman.html',
            title: 'Moses On Wunderman Identity',
            color: 'maroon'
        },
        starbucks: {
            path: 'starbucks.html',
            title: 'Moses Upped Starbucks Digital Presence',
            color: 'green'
        },
        adidas: {
            path: 'adidas.html',
            title: 'Moses Improved Adidas Retail',
            color: 'darkgray'
        },
        monalisa: {
            path: 'monalisa.html',
            title: 'Moses and the Monalisa (Concept)',
            color: 'brown'
        }
    };

    /* Generate Timeline */
    function generateTimeline () {
        var $section = $('.dynamic-content').find('.section-container');

        $section.each(function(index) {
            timeline[index] = '#'+$(this).attr('id');
            offsets[index] = Math.round($(this).position().top);
        });
    }

    /* Get the closest section from top */
    function closestSection(currentPos) {
        y = currentPos; //the current position of scroll passed from the scroll event.
        var controls = []; //new array to contain abs values of distance.

        $.each(offsets, function(){
            // Stores the abs value of the distance from current scroll position to offsetTop of each section.
            controls.push(Math.abs(this - y));
        });
        min = Math.min.apply( Math, controls ); //which abs value is smallest?

        return $.inArray(min, controls); //returns the array index of lowest abs value.
    }

    /* Update Scroll Link */
    function setControlLinks(indicator) {
        if(indicator == 0) {
            $('.pagescroll-controls > a.next').attr('href', timeline[indicator+1]);
        }
        else if(indicator == timeline.length-1) {
            $('.pagescroll-controls > a.next').css({opacity: 0, visibility: 'hidden'});
        }
        else {
            $('.pagescroll-controls > a.next').attr('href', timeline[indicator+1]).css({opacity: 0.5, visibility: 'visible'});
        }
    }

    /* Remove Class Function */
    $.fn.removeClassPrefix = function (prefix) {
        this.each( function ( i, it ) {
            var classes = it.className.split(" ").map(function (item) {
                return item.indexOf(prefix) === 0 ? "" : item;
            });
            it.className = classes.join(" ");
        });
        return this;
    }

    /* Page Loader Initialize */
    function pageLoaderInit(elem1, elem2) {
        var progress = new TimelineMax();

        progress
            .to(elem1, 1,{width:'100%', ease:Power2.easeIn})
            .to(elem2, 1,{width:'100%', ease:Power3.easeOut})
            .staggerTo($('.hero-col'), 0.2, {className:'+=animated', onComplete: changeImgSrc}, 0, '-=0.75')
            .set($('.menu-toggle'), {className: '+=chart-bar'})
            .set($('.pagescroll-controls'), {className: '-=hidden'});
    }

    function changeImgSrc() {
        var imgNeedtoChange = doc.querySelector('.imgNeedtoChange');

        if(imgNeedtoChange) {
            var clip = $('.hero-col').find('.imgNeedtoChange');

            clip.each(function () {
                var clipImg = $(this).children('img'),
                    newImg = clipImg.data('replacement');
                clipImg.attr('src', newImg);
            });
        }
        return false;
    }

    /* Add some action on window load */
    $(win).on('load', function(e) {
        var loader1 = $('.path-loader-1'),
            loader2 = $('.path-loader-2');

        timeline = [];
        offsets = [];

        pageLoaderInit(loader1, loader2);

        var isScrollable    = doc.querySelector('.scrollable-content');
        if(isScrollable) {
            generateTimeline();
            var indicator = closestSection($(win).scrollTop());
            setControlLinks(indicator);

            $('.pagescroll-controls a').bind('click.' + mosClick, function (e) {
                e.preventDefault();
                var target = ($(this).attr('href').length > 1) ? $(this).attr('href') : 0;
                TweenMax.to(win, 2, {scrollTo:{y:target}, ease:Power3.easeOut});
            });
        }
        var pageLocation = location.pathname.split('/'),
            pageLoaded = pageLocation[pageLocation.length - 1].replace('.html', ''),
            currentPage = (mPages.indexOf(pageLoaded) != -1) ? pageLoaded : 'index';

        win.history.replaceState(pages[currentPage], '', pages[currentPage].path);
    });

    /* Main Navigation Control */
    $('.nav-menu').on('click', '[data-type="page-transition"]', function(e) {
        var $this           = $(this),
            parentNav       = $this.parents('.main-nav'),
            pageLocation    = location.pathname.split('/'),
            currentPage     = pageLocation[pageLocation.length - 1].replace('.html', ''),
            target          = $this.attr('href').replace('.html',''),
            dataTarget      = pages[target];

        e.preventDefault();

        if(dataTarget && !isPageLoading && (target != currentPage)) {
            win.scrollTo(0, 0);

            parentNav.removeClass('menu-opened');
            parentNav.find('.nav-item').removeClass('current');
            parentNav.find('.menu-bg').removeClass('centerSlideIn');
            parentNav.find('.menu-toggle').removeClass('clicked');
            $this.parent('.nav-item').addClass('current');

            $('.hero').find('.hero-col').removeClass('animated');
            $('.pagescroll-controls a').unbind('click.' + mosClick);

            changePage(dataTarget, true);

            firstLoad = true;
        }

        e.stopPropagation();
    });

    /* Detect the 'popstate' event - e.g. user clicking the back button */
    $(win).on('popstate', function(e) {
        var state = e.originalEvent.state;

        if( firstLoad && state != null) {
            doc.title = state.title;
            /*
             * Safari emits a popstate event on page load - check if firstLoad is true before animating
             * if it's false - the page has just been loaded
             */
            var newPageArray = location.pathname.split('/'),
                //this is the url of the page to be loaded
                newPage = newPageArray[newPageArray.length - 1];

            if( !isPageLoading  &&  newLocation != newPage ) changePage(state, false);
        }
        firstLoad = true;
    });

    /* Change page content when triggered */
    function changePage(data, bool) {
        timeline = [];
        offsets = [];
        isPageLoading = true;
        $('body').addClass('page-loading cover-loading');

        loadCover(data,bool);

        if( coverLoaded ) {
            $('.mask').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                loadContent(data, bool);
                newLocation = data.path;
                $('.mask').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            });
        }

        // if browser doesn't support CSS transitions
        if( !transitionsSupported() ) {
            loadCover(data, bool);

            if( coverLoaded ) {
                loadContent(data, bool);
                newLocation = data.path;
            }
        }
    }

    /* Ajax Load Cover */
    function loadCover( data, bool ) {
        data.path = ('' == data.path) ? 'index.html' : data.path;
        var newCover = data.path.replace('.html', '');
        var cover = $('<div class="d-table ' + newCover + '-cover"></div>');

        cover.load( data.path + ' .cover .d-table > *', function(event) {
            win.addEventListener( 'scroll', noscroll );

            // Load new cover and replace <header> content with the new one
            $('header').html(cover);

            setTimeout(function(){
                $('body').removeClass('cover-loading');
            });

            if(data.path != win.location && bool){
                /*
                 * Add the new page to the window.history
                 * if the new page was triggered by a 'popstate' event, don't add it
                 */
                win.history.pushState(data, '', data.path);
            }
            doc.title = data.title;
        });

        coverLoaded = true;
    }

    /* Ajax Load Content */
    function loadContent(data, bool) {
        data.path = ('' == data.path) ? 'index.html' : data.path;
        var newContent = data.path.replace('.html', '');
        var content = $('<div class="main-content ' + newContent + '-content"></div>');

        content.load( data.path + ' .main-content > *', function(event) {
            var delay	= ( transitionsSupported() ) ? 300 : 0,
                loader1	= $('.path-loader-1'),
                loader2	= $('.path-loader-2');

            // Load new content and replace <main> content with the new one
            $('main').html(content);
            $('.menu-toggle').removeClass('chart-bar');

            setTimeout(function(){
                $('body').removeClass('page-loading').removeClassPrefix('theme-').addClass('theme-' + data.color);

                pageLoaderInit(loader1, loader2);

                $('.mask').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                    isPageLoading = false;
                    coverLoaded = false;

                    win.removeEventListener( 'scroll', noscroll );
                    $('.mask').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                });

                if( !transitionsSupported() ) isPageLoading = false;
            }, delay);

            var isScrollable = doc.querySelector('.scrollable-content');

            if(isScrollable) {
                generateTimeline();
                var indicator = closestSection($(win).scrollTop());
                setControlLinks(indicator);

                $('.pagescroll-controls a').bind('click.' + mosClick, function (e) {
                    e.preventDefault();
                    var target = ($(this).attr('href').length > 1) ? $(this).attr('href') : 0;
                    TweenMax.to(win, 2, {scrollTo:{y:target}, ease:Power3.easeOut});
                });
            }
        });
    }

    /* Scroll window to top */
    function noscroll() {
        win.scrollTo( 0, 0 );
    }

    /* Check if css transition supported */
    function transitionsSupported() {
        return $('html').hasClass('csstransitions');
    }

    /* Menu Toggle */
    $('.main-nav').each(function () {
        var $this = $(this),
            cover = $('#cover'),
            winHeight = $(win).height(),
            toggleWrapper = $this.find('.toggle-wrapper'),
            toggle = toggleWrapper.children('.menu-toggle');

        $this
            .on('mouseenter', function() {
                toggle.addClass('hovered');

                if ( $(win).scrollTop() > winHeight / 2 ) {
                    cover.addClass('zi-1').find('#main-title').removeClass('fade-out').addClass('fade-in');
                }
            })
            .on('mouseleave', function () {
                toggle.removeClass('hovered');

                if ( $(win).scrollTop() > winHeight / 2 && ! toggle.hasClass('clicked')) {
                    cover.removeClass('zi-1').find('#main-title').removeClass('fade-in').addClass('fade-out');
                }
            })
            .on('click tap', function (ev) {
                ev.preventDefault();

                if ( ! $this.hasClass('menu-opened') ) {
                    $this.addClass('menu-opened').find('.menu-bg').addClass('centerSlideIn');
                    toggle.addClass('clicked');

                    if ( $(win).scrollTop() > winHeight / 2 ) {
                        cover.addClass('zi-1').find('#main-title').removeClass('fade-out').addClass('fade-in');
                    }
                } else {
                    $this.removeClass('menu-opened').find('.menu-bg').removeClass('centerSlideIn');
                    toggle.removeClass('clicked');

                    if ( $(win).scrollTop() > winHeight / 2 ) {
                        cover.removeClass('zi-1').find('#main-title').removeClass('fade-in').addClass('fade-out');
                    }
                }
            });
    });

    /* Window Scroll Function */
    $(win).scroll(function() {
        var cover       = $('#cover'),
            mainNav     = $('.main-nav'),
            docHeight   = $(doc).height(),
            winHeight   = $(win).height(),
            scrollPos   = winHeight + $(win).scrollTop(),
            indicator   = closestSection($(win).scrollTop());

        if( ( $(win).scrollTop() > winHeight / 2 ) && ( ! mainNav.hasClass('menu-opened') ) ) {
            $('#cover').removeClass('zi-1').find('.cover-title').removeClass('fade-in').addClass('fade-out');
        }
        else if($(win).scrollTop() < winHeight / 2) {
            $('#cover').addClass('zi-1').find('.cover-title').removeClass('fade-out').addClass('fade-in');
        }

        setControlLinks(indicator);

        $('.page-wrapper').attr('data-doch',scrollPos);

        if ((docHeight - scrollPos) < (winHeight / 3)) {
            $('a.scrolltop').css({opacity: 0.5, visibility: 'visible'});
        } else {
            $('a.scrolltop').css({opacity: 0, visibility: 'hidden'});
        }
    });
}(jQuery, window, document));
