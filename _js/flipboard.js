var   PHOTOS = []
    , PHOTOS_LOCAL
    , PHOTOS_FLICKR
    , ASPECT_RATIO = 1.5
    , PORTRAIT_CLASS = 'portrait'
    , MAX_WIDTH = 240
    , MIN_WIDTH = 175
    , FLIP_INTERVAL = 2 * 1000 // in ms
    , FLIPBOARD_SELECTOR = '.flipboard'
    , FLIPBOARD_CLASS_ON_PLAY = 'playing'
    , HIDE_FLIPBOARD_ON_STOP = false
    , CARD_TEMPLATE = '#card-template'
    , CARD_SELECTOR = 'li'
    , FRAME_SELECTOR = '.flipcard'
    , FRONT_FACE = '.face.front'
    , BACK_FACE = '.face.back'
    , TRANSITION_TIME = 0.4 * 1000 // in ms
    , TRANSITION_TO_BACK = 'reveal-backface'
    , TRANSITION_TO_FRONT = 'reveal-frontface'
    , active_board
    ;

function Flipboard () {
    var   o = this
        , $board = $(FLIPBOARD_SELECTOR)
        , $parent = $(window)
        , cards = []
        , images = []
        , card_template = _.template($(CARD_TEMPLATE).html())
        , shuffled_photos = []
        , shuffled_cards = []
        , flipper
        , animator
        , animation_queue = []
        , resize_handler
        , columns, rows, width, height;
    
    
    function reset_dimensions () {
        var   full_width = $parent.width()
            , full_height = Math.max($parent.height(), $board.height())
            , raw_rows;
        
        // start with _ideal_ number of cols
        columns = Math.ceil(full_width / MAX_WIDTH)
        
        do {

            width = Math.floor(full_width / columns);
            raw_rows = full_height / (width / ASPECT_RATIO);
            rows = Math.ceil(raw_rows);
            
        } while ( 

            // try increasing the number of columns and iterating if the height clipping is beyond a certain percentage
            rows - raw_rows >= 0.5 &&
            full_width/columns >= MIN_WIDTH &&
            columns++
        );

        // now that we have the number of cols and rows, we compute the _ideal_ height
        height = Math.floor(full_height / rows);


        // at this point we have whole number for cols, rows and each card's dimensions
        // however, there will most likely be a few extra horizontal & vertical pixels
        // <del>so we first look for flexbox and outsource this problem to the browser if possible</del>
        // <ins>for now we'll just reduce the size of our board to suit our whole numbers</ins>

        $board.show().css({
              'width': (columns * width) + 'px'
            , 'height': (rows * height) + 'px'
            , 'left': '50%'
            , 'top': '50%'
            // , 'margin-left': - (columns * width / 2) + 'px'
            // , 'margin-top': - (rows * height / 2) + 'px'
        });
    }
    
    function reset_cards () {
        
        var   $card
            , count_loaded_images = 0
            , dfd = $.Deferred()
            ;
        
        // add new cards
        while (cards.length < columns * rows) {
            
            var image = new Image();
            $card = $(card_template())
            
            $board.append($card);
            cards[cards.length] = $card[0];
            images[cards.length-1] = image;
            
            // opacity fallback for older browsers — hide back faces when cards reset
            !Modernizr.csstransforms3d &&
            $(BACK_FACE, $card[0]).hide();
            
            if(!flipper) {
                $(image).load(function() { 
                    count_loaded_images++;
                    if (count_loaded_images >= columns * rows) {
                        for (var i = count_loaded_images-1; i >= 0; i--) 
                            flip_card(cards[i], false, images[i]);
                        dfd.resolve();
                    }
                });
                image.src = get_random_photo();
            } else flip_card($card[0]);
        }
        
        // discard unused cards
        while (cards.length > columns * rows) $(cards.pop()).remove();
        
        // update card dimensions
        $(cards).width(width).height(height);
        
        // reset card flipper
        shuffled_cards = [];
        
        return dfd.promise();
    }
    
    function get_random_photo () {
        if (!shuffled_photos || !shuffled_photos.length) shuffled_photos = _.shuffle(PHOTOS);
        
        return shuffled_photos.shift();
    }
    
    function get_random_card () {
        if (!shuffled_cards || !shuffled_cards.length) shuffled_cards = _.shuffle(cards);
        
        return shuffled_cards.shift();
    }
    
    function flip_card (card, close_card, img) {
        
        // close card or flip over with a new image
        close_card = !!close_card;
        
        var   $frame = $(FRAME_SELECTOR, card || get_random_card())
            , image = (close_card ? null : (img ? img : new Image()))
            , transition
            ;
        
        if ($frame.hasClass(TRANSITION_TO_BACK)) {
            transition = {
                  $face: $(FRONT_FACE, $frame)
                , addClass: TRANSITION_TO_FRONT
                , removeClass: TRANSITION_TO_BACK
            }
        } else {
            transition = {
                  $face: $(BACK_FACE, $frame)
                , addClass: TRANSITION_TO_BACK
                , removeClass: TRANSITION_TO_FRONT
            }
        }
        
        function flip () {
            animate(function() {
                
                transition.$face.empty().removeClass(PORTRAIT_CLASS);
                
                if (image) {
                    if (image.width < image.height) transition.$face.addClass(PORTRAIT_CLASS)
                    transition.$face.append(image);
                }
                
                $frame.addClass(transition.addClass).removeClass(transition.removeClass);
                
                // opacity fallback for older browsers
                !Modernizr.csstransforms3d &&
                (transition.addClass == TRANSITION_TO_FRONT && 
                ($(BACK_FACE, $frame).fadeOut('slow') && $(FRONT_FACE, $frame).fadeIn('slow')) ||
                ($(FRONT_FACE, $frame).fadeOut('slow') && $(BACK_FACE, $frame).fadeIn('slow')))                    
            });
        }
        
        if (image && image.src) flip();
        else if (image) {
            $(image).load(flip);
            image.src = get_random_photo();
        } else flip();
        
    }
    
    function animate (animation) {
        if (animation && typeof animation == 'function') animation_queue.push(animation);
        
        if (!animator) animator = window.setInterval(function() {
            
            if (animation_queue.length) {
                (animation_queue.shift())();
                
            } else {
                window.clearInterval(animator);
                animator = null;
            }
            
        }, 25);
    }
    
    function start_flipping () {
        if (!flipper) flipper = window.setInterval(function(){flip_card()}, FLIP_INTERVAL);
        $board.addClass(FLIPBOARD_CLASS_ON_PLAY);
    }
    
    function stop_flipping () {
        if (!flipper) return;

        window.clearInterval(flipper);
        flipper = null;
        
        $board.removeClass(FLIPBOARD_CLASS_ON_PLAY);
    }
    
    this.reset = function() {
        reset_dimensions();
        if(flipper) reset_cards();
    };
    
    this.setup = function(silent) {
        if (!resize_handler) resize_handler = _.throttle(o.reset, 100); // execute max. once per 100 ms
        
        $(window).on('resize', silent, resize_handler);
        
        resize_handler(silent);
    }
    
    this.start = function() {
        $(window).off('resize', resize_handler);
        this.setup();
        $.when(reset_cards()).done(start_flipping);    
    };
    
    this.stop = function() {
        stop_flipping();
    };

}
