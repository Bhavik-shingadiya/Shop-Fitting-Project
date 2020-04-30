import swal from '../global/sweet-alert';
import utils from '@bigcommerce/stencil-utils';

export default function(){
  ///Remove All cart js
  if($('.cart-remove').length){
    var itmcart = [];
    $('.cart-remove').each(function(){
        itmcart.push($(this).attr('data-cart-itemid'));
    });
    console.log(itmcart)

    $(document).on('click','.rmvall',function(){
        if(itmcart.length){
          swal({
              text: "Are you sure want to emprty your cart?",
              type: 'warning',
              showCancelButton: true,
          }).then(() => {
              // remove item from cart
              $('.loadingOverlay').css('display','block')
              rmvCart(itmcart);
          });

        }
    });
    function rmvCart(data){
     if(itmcart.length){
          utils.api.cart.itemRemove(itmcart.pop(), (err, response) => {
              if (response.data.status === 'succeed') {
                 if(itmcart.length){
                   rmvCart(itmcart)
                 }else {
                   $('.loadingOverlay').css('display','none');
                   location.reload(true);
                 }
              } else {
                  swal({
                      text: response.data.errors.join('\n'),
                      type: 'error',
                  });
              }
          });
        } else {
          location.reload(true);
        }
     }

  }
}
