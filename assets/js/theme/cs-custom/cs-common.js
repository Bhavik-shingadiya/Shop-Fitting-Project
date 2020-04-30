import superfish from 'superfish/dist/js/superfish.min';
import treeviewjs from 'jquery.treemenu.js/jquery.treemenu.js';
import whatwg from 'whatwg-fetch';
import responsiveTabs from 'responsive-tabs/js/jquery.responsiveTabs.min';
import chosen from 'chosen-js/chosen.jquery.min';

/* eslint-disable */
export default function() {
  document.addEventListener('click', function (e) {
    if (e.currentTarget.activeElement.id != 'quickSearch') {
      document.querySelector('.quickSearchResults').innerHTML = '';
    }
  });

  //start ready
  jQuery(document).ready(function() {

    $('.videoGallery-list').slick({
          dots: false,
          //infinite: false,
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 3,
          arrows: false,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4000,
          responsive: [
            {
              breakpoint: 1441,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1023,
              settings: {
                slidesToShow: 2,
                dots: true,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 2,
                dots: true,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 668,
              settings: {
                slidesToShow: 1,
                dots: true,
                slidesToScroll: 1
              }
            }
          ]
        });

    $("#description-more").click(function() {
          $('html,body').animate({                                                          //  fine in moz, still quicker in chrome.
              scrollTop: $("#description").offset().top - 280},
              'slow');
    });

    $('.ex-vat-box').click(function() {
      $(this).addClass('active');
      $('.inc-vat-box').removeClass('active');
      $('.pirce-withtax-box').hide();
      $('.pirce-withouttax-box').show();
    });

    $('.inc-vat-box').click(function() {
      $(this).addClass('active');
      $('.ex-vat-box').removeClass('active');
      $('.pirce-withtax-box').show();
      $('.pirce-withouttax-box').hide();
    });

    /* ==================  Product page - Description tabs  ========*/
    let $Descriptiontabs = $('#Product-descrTabs');
    $Descriptiontabs.responsiveTabs({
      rotate: false,
      startCollapsed: 'accordion',
      collapsible: 'accordion',
      setHash: false,
      click: function(e, tab) {},
      deactivate: function(event, tab){ },
      activate: function(e, tab) {
        $(".productCarousel.slick-initialized").slick('setPosition');
      },
      activateState: function(e, state) {}
    });

    /* category add qty */
    $('.add-product-cart').click(function(e) {
      e.preventDefault();
      let productId = $(this).data('product-id');
      let productQty = $('#product-'+productId).find('.qty-box input').val() || 1;
      let cartUrl = `/cart.php?action=add&qty[]=${productQty}&product_id=${productId}`;
      window.location.href = cartUrl;
    });
    /* ==== superfish SCRIPT ==== */
    setTimeout(function () {
      jQuery('#menu ul.navPages-list').eq(0).clone().insertAfter(jQuery('#menu ul.navPages-list').eq(0));
      jQuery('#menu ul.navPages-list').eq(1).removeClass('sf-menu').addClass('mobileNavigation').addClass('tree');

      jQuery('ul.navPages-list.sf-menu').superfish({
        delay:		 0
      });

      //treeview
       jQuery(".mobileNavigation").treemenu({
       'delay': 300,
        });

        jQuery(".mobileNavigation .left-panel").treemenu({
        'delay': 300,
         });

        jQuery(".mobileNavigation .container").treemenu({
        'delay': 300,
         });

    }, 1000);


    /* page scroll script */

    $('a[href="#cat-bottom"]').on('click',function(){
    jQuery('html, body').animate({
        'scrollTop' : $('.type-category .cat-bottom-text').offset().top
    },2000);
  });

    $('a[href="#about-range"]').on('click',function(){
    jQuery('html, body').animate({
        'scrollTop' : $('.type-category .cat-bottom-text #about-range').offset().top

    },2000);
  });

  $('a[href="#featuresbenefits"]').on('click',function(){
  jQuery('html, body').animate({
      'scrollTop' : $('.type-category .cat-bottom-text #featuresbenefits').offset().top
  },2000);
});

$('a[href="#optionextra"]').on('click',function(){
jQuery('html, body').animate({
    'scrollTop' : $('.type-category .cat-bottom-text .option-extras').offset().top
},2000);
});


// Get all possible Blog Tags from hidden dummy post and append to sidebar

  let dummyTags = [];
  let mainCategoryTags = [];
  let subCategoryTags = [];
  const dummyRequest = window.fetch('/blog/tags-dummy/').then(res => res.ok ? res.text() : console.log("Tag-Fetch-Fail."))
    .then(html => {
      const $dummyTags = $(html).find('li.tag a').each((i, e) => {
        dummyTags.push({
          name: e.innerText.replace('#', ''),
          url: e.href,
        })
      });


      dummyTags.forEach(tag => {
        const standardizedTagName = tag.name.trim()
        const splitTag = standardizedTagName.split('-');
        if (splitTag.length === 1) {
          mainCategoryTags.push({
            name: standardizedTagName,
            url: tag.url
          })
        } else if (splitTag.length > 1) {
          const parentCategoryTagName = splitTag[0];
          const subCategoryTagName = splitTag[1];
          subCategoryTags.push({
            name: subCategoryTagName.trim(),
            parent: parentCategoryTagName.trim(),
            url: tag.url,
          })
        }
      });

      mainCategoryTags.forEach(tagData => {
        return $(`<a class='taglink-main-category' href=${tagData.url}>${tagData.name}</a>`)
          .appendTo('.blog-sidebar-taglinks.unique-tags')
      })
      subCategoryTags.forEach(tagData => {
        return $(`<a class='sub-category' href=${tagData.url}>${tagData.name}</a>`)
          .insertAfter(`.taglink-main-category:contains(${tagData.parent})`)
      })

      if(mainCategoryTags.length) {
        $('.blog-topics').addClass("got-length");
      }

    })



    // blog hide show article
      let limitshow = $('.blog-post-inner').data('limit-show');
      let limitload = $('.blog-post-inner').data('limit-load');

      $('.blog-post-inner .blog:lt(' + limitshow + ')').slideDown('slow');
      $('.blog-post-inner .blog:lt(' + limitshow + ')').addClass('show');

      const totalBlog = $('.blog-post-inner .blog').length;
      console.log(totalBlog);
      $('.load-more-btn').on('click', function (e) {
        e.preventDefault();
        $(this).find('a').text('Loading...');
        setTimeout(() => {
          limitshow = limitshow + limitload;
          $('.blog-post-inner .blog').slice(0, limitshow).slideDown();
          $('.blog-post-inner .blog').slice(0, limitshow).addClass('show');
          const totalVisibleBlog = $('.blog-post-inner .blog.show').length;
          if(totalBlog == totalVisibleBlog) {
            $(this).find('a').text('No More Articles');
            $('.load-more-btn').unbind('click');
          } else {
            $(this).find('a').text('View More Articles');
          }
        }, 1000);
      });
    // blog side bar custom
    jQuery(".blog-sidebar.custom-recent-posts").load("/ .footer-blog.footer-info-list");
    // blog side bar custom end

    $(".recent-blog-post .blog-post div").css({"-webkit-box-orient": "vertical"});

    /* ============ FOOTER TOGGLE SCRIPT ============ */
        jQuery(document).on('click', '.footer-info-col .footer-info-heading', function () {
          if (jQuery(window).width() <= 767) {
            jQuery(this).parent().find('.footer-info-list').slideToggle();
            jQuery(this).toggleClass('active');
          }
        });

        /* ============ blog category toggle ============ */
            jQuery(document).on('click', '.blog-cat h3', function () {
              if (jQuery(window).width() <= 767) {
                jQuery(this).parent().find('.blog-sidebar-taglinks').slideToggle();
                jQuery(this).toggleClass('active');
              }
            });

            jQuery(document).on('click', '.recent-post-section .blog-cat h3', function () {
              if (jQuery(window).width() <= 767) {
                jQuery(this).parent().find('.blog-sidebar.custom-recent-posts').slideToggle();
                jQuery(this).toggleClass('active');
              }
            });

            $(function() {
    $('.home-top-usp-banner .container ul').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
        mobileFirst: true,
        arrows: false,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 767,
                settings: 'unslick'
            }
        ]
    });

    $(window).on('resize', function() {
        $('.carousel').slick('resize');
    });
});

//Sticky header SCRIPT

/*let stuckyheight = $('.header-sticky-wrap').height();
window.onscroll = function () {
let headerHeight = $('.header').outerHeight();
  if (($(window).width()>= 320) && ($(window).scrollTop() > (headerHeight))) {
$('.header').addClass("sticky");
$("body").addClass("sticky-menu");
  $('.sticky-wrapper').height(headerHeight);
} else {
    $('.body').removeAttr('style');
    $('.sticky-wrapper').removeAttr('style');
    if ($('.header').hasClass('sticky')) {
      $('.header').removeClass("sticky");
      $("body").removeClass("sticky-menu");
    }
}
};*/





  }); // READY END

  /* new sticky header js */

  // Get the header
  // let header = document.querySelector(".header");
  //
  // // Get the offset position of the navbar
  // let sticky = header.offsetTop;
  // let headerHeight = $('.header.apply-sticky').height();
  //
  // window.onscroll = function () {
  //
  //   let headerHeight1 = headerHeight
  //
  //   if ($(window).scrollTop() > 10) {
  //
  //     header.classList.add("stuck");
  //     $("body").addClass("sticky-menu");
  //     $('.body').css('margin', ($('.header.stuck').height()) + 'px 0px 0px 0px');
  //     setTimeout(function () {
  //       $('.sticky-menu .home-top-usp-banner').fadeOut('fast');
  //     }, 1000);
  //   } else {
  //
  //     if ($('.header').hasClass('stuck')) {
  //       header.classList.remove("stuck");
  //
  //       $("body").removeClass("sticky-menu");
  //       $('.body').removeClass('body-stuck').css('margin-top', '0px');
  //       // if($(window).width() > 1023){
  //       $('.home-top-usp-banner').fadeIn('slow');
  //       //}
  //     }
  //
  //   }
  //
  // };
  // window.onscroll = function() {myFunction()};

  // var header = document.getElementById("myHeader");
  // var sticky = header.offsetTop;
  //
  // function myFunction() {
  //   if (window.pageYOffset > sticky) {
  //     header.classList.add("sticky");
  //   } else {
  //     header.classList.remove("sticky");
  //   }
  // }
}

/* eslint-enable */
