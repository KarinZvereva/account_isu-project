$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  
  var $window = $(window);
  var $messages = $('.messages'); 
  var $inputMessage = $('.inputMessage'); 
  var $chatPage = $('.chat.page'); 
  var $listdialogs = $('.friends'); 

  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;

  //var $currentInput = $inputMessage.focus();

  var socket = io();


  const setUsername = () => {
    var user;
    $.ajax({
      type: "POST",
      url: "/getuser",
      success: function(user) {
        username = user.username;
        if (username) {
          socket.emit('add user', username);
        }
      }
    });
   
  }

  friends = []

  $('option').dblclick(function() {
  if (friends.indexOf($(this).val()) == -1 ) {
      var $dialog = $('<li class="dialog"/>')
      .text($(this).text())
      .attr("id", ($(this).val()))
      friends.push($(this).val())
      console.log(friends)
      $('.friends').append($dialog)
      chooseUser($dialog)
  }
  else {
    chooseUser($('#'+$(this).val()))
  }
  
  
  });

  $(document).on('click','li.dialog', function(){
      chooseUser($(this))
  });

  var friend = "";

  var chooseUser = function(elem) {
    $('ul.friends li').css({"background-color":"#fff"})
      elem.css({"background-color":"#eee"})
    friend = elem.attr("id");
  }

  setUsername();

  const sendMessage = () => {
    var message = $inputMessage.val();
    message = cleanInput(message);
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      console.log(friend)
      socket.emit('new message', message, friend);
    }
  }

    const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }



  
  const addChatMessage = (data, options) => {
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }


  const addChatTyping = (data) => {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  const removeChatTyping = (data) => {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  const addMessageElement = (el, options) => {
    var $el = $(el);

    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }

  const updateTyping = () => {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing', friend);
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(() => {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing', friend);
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  const getTypingMessages = (data) => {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }


  $window.keydown(event => {
   
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } 
    }
  });

  $inputMessage.on('input', () => {
    updateTyping();
  });


  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  // Socket events

  socket.on('login', () => {
    connected = true;
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    log(data.username + ' joined');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    log(data.username + ' left');
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', (data) => {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', (data) => {
    removeChatTyping(data);
  });

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    //log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    //log('attempt to reconnect has failed');
  });

  


});