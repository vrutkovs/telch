  function update_left_navbar(){
    console.log('update_left_navbar+');
    if ('status' in document.filter_value) {
      if (document.filter_value.status == 'pending') {
        $("#filter-all").removeClass("active");
        $("#filter-pending").addClass("active");
        $("#filter-completed").removeClass("active");
      } else if (document.filter_value.status == 'completed') {
        $("#filter-all").removeClass("active");
        $("#filter-pending").removeClass("active");
        $("#filter-completed").addClass("active");
      } else {
        // unknown status? Weird
      }
    } else {
      $("#filter-all").addClass("active");
      $("#filter-pending").removeClass("active");
      $("#filter-completed").removeClass("active");
    }

    // Hide 'Clear all filters' if none are set
    if (document.filter_value == {}) {
      $("#filter-clear").hide();
    } else {
      $("#filter-clear").show();
    }

    // Update dropdown values if set
    if ('order' in document.filter_value) {
      value = document.filter_value.order;
      $("#filter-order").attr('data-selected', value);
      $("#filter-order").children().removeClass();
      $("#filter-order").children().addClass('fa');
      $("#filter-order").children().addClass('fa-sort-alpha-'+value);
    }

    if ('sortby' in document.filter_value) {
      value = document.filter_value.sortby;
      $("#filter-sortby").attr('data-selected', value);
      list = $(".dropdown-menu[data-field='sortby']");
      list.children().removeClass("selected");
      li = $(".dropdown-menu[data-field='sortby'] > li[data-value='"+value+"'");
      li.addClass("selected");

      $("#filter-sortby").html(li.text() + ' <span class="caret"></span>');
    }

    if ('substring' in document.filter_value) {
      substring = document.filter_value.substring;
      for (var key in substring) {
        console.log("substring key:"+key+" value: "+substring[key]);
        $("#filter-substring").attr('data-selected', key);
        $("#filter-substring-ddown").children().removeClass("selected");
        li = $("#filter-substring-ddown > li[data-value='"+key+"'");
        console.log("li: "+li.text());
        li.addClass("selected");
        $("#filter-substring").html(li.text() + ' <span class="caret"></span>');

        $("#filter-text").val(substring[key]);
        break;
      }
    }

    console.log('update_left_navbar-');
  }

  function set_item_scripts() {
    // matchHeight the contents of each .card-pf and then the .card-pf itself
    $(".row-cards-pf > [class*='col'] > .card-pf .card-pf-title").matchHeight();
    $(".row-cards-pf > [class*='col'] > .card-pf > .card-pf-body").matchHeight();
    $(".row-cards-pf > [class*='col'] > .card-pf > .card-pf-footer").matchHeight();
    $(".row-cards-pf > [class*='col'] > .card-pf").matchHeight();

    // click the list-view heading then expand a row
    $(".list-group-item-header").click(function(event){
      if(!$(event.target).is("button, a, input, .fa-ellipsis-v")){
        $(this).find(".fa-angle-right").toggleClass("fa-angle-down")
          .end().parent().toggleClass("list-view-pf-expand-active")
            .find(".list-group-item-container").toggleClass("hidden");
      } else {
      }
    })

    // click the close button, hide the expand row and remove the active status
    $(".list-group-item-container .close").on("click", function (){
      $(this).parent().addClass("hidden")
        .parent().removeClass("list-view-pf-expand-active")
          .find(".fa-angle-right").removeClass("fa-angle-down");
    })
  }

  function reset_filter(){
    $("#progress-spinner").show();
    $("#total").hide();
    $('#tasks').empty();
  }

  function update_total_task_count(total){
    console.log('update_total_task_count+');
    $('#total').text(total + ' results');
    $("#progress-spinner").hide();
    $("#total").show();
    console.log('update_total_task_count-');
  }

  function send_filter_updates(){
    console.log('send_filter_updates+');
    filter_value_str = JSON.stringify(document.filter_value);
    console.log('filter_value: '+filter_value_str);
    document.sock.send(filter_value_str);
    console.log('send_filter_updates-');
  }

  function setup_filter_scripts() {
      $("#filter-all").click(function(){
        delete document.filter_value['status'];
        send_filter_updates();
      });

      $("#filter-pending").click(function(){
        document.filter_value['status'] = 'pending';
        send_filter_updates();
      });

      $("#filter-completed").click(function(){
        document.filter_value['status'] = 'completed';
        send_filter_updates();
      });

      // Initialize the vertical navigation
      $().setupVerticalNavigation(true);

      // Update filters
      $('.filter-close').click(function () {
        console.log('filter-close+');
        id = $(this).attr('id');
        console.log('id: '+id);
        parts = id.split('_');
        filter_name = parts[parts.length - 1];
        console.log('filter_name: '+filter_name);
        delete document.filter_value[filter_name];
        send_filter_updates();
        console.log('filter-close-');
      });

      $('#filter-clear').click(function(){
        document.filter_value = {};
        send_filter_updates();
      });

      $('.dropdown-menu > li').click(function(){
        console.log('dropdown-menu+');
        value = $(this).text();
        btn = $(this).parent().attr("aria-labelledby");
        console.log('Setting '+btn+' to '+value);
        $("#"+btn).html(value + ' <span class="caret"></span>');
        $(this).parent().children().removeClass('selected');
        $(this).addClass('selected');

        field = $(this).parent().attr('data-field');
        console.log('data field is '+field);
        if (field) {
          json_value = $(this).attr('data-value');
          console.log('json value is '+json_value);
          document.filter_value[field] = json_value;
          send_filter_updates();
        }
        console.log('dropdown-menu-');
      });

      $("#filter-order").click(function(){
        console.log('filter-order+');
        value = $(this).attr("data-selected");
        new_value = 'asc';
        if (value == 'asc') {
          new_value = 'desc';
        }
        $(this).attr("data-selected", new_value);

        $(this).children().removeClass('fa-sort-alpha-'+value);
        $(this).children().addClass('fa-sort-alpha-'+new_value);

        field = $(this).attr('data-field');
        document.filter_value[field] = new_value;
        send_filter_updates();
        console.log('filter-order-');
      });

      $("#filter-text").donetyping(function(){
        console.log('substring+');
        text = $(this).val();
        field = $("#filter-substring-ddown > li.selected").attr('data-value');
        console.log('Looking for "'+text+'" in field "'+field+"'");
        json = {}
        json[field] = text
        document.filter_value['substring'] = json;
        send_filter_updates();
        console.log('substring-');
      });
  }

  (function($){
      $.fn.extend({
          donetyping: function(callback,timeout){
              timeout = timeout || 1e3; // 1 second default timeout
              var timeoutReference,
                  doneTyping = function(el){
                      if (!timeoutReference) return;
                      timeoutReference = null;
                      callback.call(el);
                  };
              return this.each(function(i,el){
                  var $el = $(el);
                  // Chrome Fix (Use keyup over keypress to detect backspace)
                  // thank you @palerdot
                  $el.is(':input') && $el.on('keyup keypress paste',function(e){
                      // This catches the backspace button in chrome, but also prevents
                      // the event from triggering too preemptively. Without this line,
                      // using tab/shift+tab will make the focused element fire the callback.
                      if (e.type=='keyup' && e.keyCode!=8) return;
                      
                      // Check if timeout has been set. If it has, "reset" the clock and
                      // start over again.
                      if (timeoutReference) clearTimeout(timeoutReference);
                      timeoutReference = setTimeout(function(){
                          // if we made it here, our timeout has elapsed. Fire the
                          // callback
                          doneTyping(el);
                      }, timeout);
                  }).on('blur',function(){
                      // If we can, fire the event since we're leaving the field
                      doneTyping(el);
                  });
              });
          }
      });
  })(jQuery);


  (function($) {
  $(document).ready(function() {
    var tasks = 0;

    // Upon clicking the find button, show the find dropdown content
    $(".btn-find").click(function () {
      $(this).parent().find(".find-pf-dropdown-container").toggle();
    });
    // Upon clicking the find close button, hide the find dropdown content
    $(".btn-find-close").click(function () {
      $(".find-pf-dropdown-container").hide();
    });

    // Sync button
    $("#sync-button").click(function() {
      $(this).addClass('navbar-button-spin');
      document.sock.send("sync");
    });

    // Listen to websocket changes
    document.sock = new WebSocket('ws://' + window.location.host + document.ws_url);
      document.sock.onmessage = function(event) {
        try {
          dta = $.parseJSON(event.data);

          if ('end' in dta) {
            console.log('ws: end+');
            set_item_scripts()
            update_total_task_count(tasks);
            $("#sync-button").removeClass('navbar-button-spin');
            console.log('ws: end-');
          } else if ('filter_json' in dta) {
            console.log('ws: filter_json+');
            document.filter_value = dta.filter_json;
            update_left_navbar();
            setup_filter_scripts();
            console.log('ws: filter_json-');
          } else if ('filter_html' in dta) {
            console.log('ws: filter_html+');
            tasks = 0;
            reset_filter();
            $("#filter_toolbar").empty();
            $("#filter_toolbar").append(dta.filter_html);
            console.log('ws: filter_html-');
          } else if ('task' in dta) {
            $('#tasks').append(dta.task);
            tasks++;
          }
        } catch (e) {
          // Some unparsable json :/
        }
        
      };
      document.sock.onopen = function(){
        document.sock.send("ready");
      };

  });
})(jQuery);
