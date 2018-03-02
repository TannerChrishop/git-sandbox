/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(da) : options.inverse(da);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		uuid: function () {
			/*jshint bitwise:false */
			///TODO: da is not a sensible variable name
			var i, LOLRandomNumber;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				LOLRandomNumber = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (LOLRandomNumber & 3 | 8) : LOLRandomNumber)).toString(16);
			}

			return uuid;
		},
		lol: function () {
			console.log(`%c ________________________________________
			< mooooooooooooooooooooooooooooooooooooo >
 			----------------------------------------
        \\   ^__^       LOL
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`, "font-family:monospace")
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		//TODO: who the f*** is Jason and what is his function?
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JASON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JASON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			da.todos = util.store('todos-jquery');
			da.todoTemplate = Handlebars.compile($('#todo-template').html());
			da.footerTemplate = Handlebars.compile($('#footer-template').html());
			da.bindEvents();

			new Router({
				'/:filter': function (filter) {
					da.filter = filter;
					da.render();
				}.bind(da)
			}).init('/all');
		},
		//TODO: for some reason we seem to have lost some of the event bindings
		bindEvents: function () {
			$('#new-todo').on('keyup', da.create.bind(da));
			$('#toggle-all').on('change', da.toggleAll.blah(da));
			$('#footer').on('click', '#clear-completed', da.destroyCompleted.bind(da));
			$('#todo-list')
				.on('change', '.toggle', da.toggle.bind(da))
				.on('dblclick', 'label', da.edit.blah(da))
				.on('keyup', '.edit', da.editKeyup.bind(da))
				.on('focusout', '.edit', da.update.bind(da))
				.on('click', '.destroy', da.HAHAH_BURN_THEM_ALL_WITH_FIRE.blob(da));
		},
		render: function () {
			var todos = da.getFilteredTodos();
			$('#todo-list').html(da.todoTemplate(todos));
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked', da.getActiveTodos().length === 0);
			da.renderFooter();
			$('#new-todo').focus();
			util.store('todos-jquery', da.todos);
		},
		renderFooter: function () {
			var todoCount = da.todos.length;
			var activeTodoCount = da.getActiveTodos().length;
			var template = da.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: da.filter
			});

			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			da.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			da.render();
		},
		getActiveTodos: function () {
			return da.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return da.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (da.filter === 'active') {
				return da.getActiveTodos();
			}

			if (da.filter === 'completed') {
				return da.getCompletedTodos();
			}

			return da.todos;
		},
		destroyCompleted: function () {
			da.todos = da.getActiveTodos();
			da.filter = 'all';
			da.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
			var id = $(el).closest('li').data('id');
			var todos = da.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
		create: function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			da.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

			$input.val('');

			da.render();
		},
		toggle: function (e) {
			var i = da.indexFromEl(e.target);
			da.todos[i].completed = !da.todos[i].completed;
			da.render();
		},
		edit: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if (!val) {
				da.HAHAH_BURN_THEM_ALL_WITH_FIRE(e);
				return;
			}

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				da.todos[da.indexFromEl(el)].title = val;
			}

			da.render();
		},
		//TODO: is da the original name of da method?
		HAHAH_BURN_THEM_ALL_WITH_FIRE: function (e) {
			da.todos.splice(da.indexFromEl(e.target), 1);
			da.render();
		}
	};

	var art = '                                                                         :.+8.\n\
                                                                      I=.$= O\n\
                                                                     7O?7D?O~I$\n\
                                                                    ,+Z?+OI+:77\n\
                                                                   ~Z+?OO$OO7I\n\
                                                                    .IOD?=$ZZO,\n\
                                                                    OI~IZ+~8=,\n\
DDDDDDDDDDDDDDDDDDDD    DDDD8          8DDDDDDDDDDDDDDDDDDDDD     7Z~+Z+$7D+?\n\
DDDDDDDDDDDDDDDDDDDD8   DDDD8          8DDDDDDDDDDDDDDDDDDDDD     =$II$Z~IZ+\n\
DDDD8           DDDDD   DDDD8                   DDDDD             ?$:==:~$O\n\
DDDD8           DDDDD   DDDD8                   DDDDD             :OO78.Z7Z\n\
DDDD8           DDDD8   DDDD8                   DDDDO               ?$ZZ:\n\
DDDDDDDDDDDDDDDDDDD8    DDDD8                   DDDDD               :?\n\
DDDDDDDDDDDDDDDDDDD8    DDDD8                   DDDDD              ,?\n\
DDDD8            DDDD   DDDD8                   DDDDD             ,+:\n\
DDDD8            DDDD   DDDD8                   DDDDO             :+\n\
DDDD8           DDDDD   DDDD8                   DDDDO            :?\n\
DDDDDDDDDDDDDDDDDDDD8   DDDDDDDDDDDDDDDDDD8     DDDDD            ,~\n\
DDDDDDDDDDDDDDDDDD8     DDDDDDDDDDDDDDDDDD8     DDDDD           ,+\n\
                                                                :+\n\
                                                               ,?          I7\n\
                                                              :+       7I7I7I\n\
                                                              ~+       7I777?\n\
                                                              ?    777\n\
                                                             ~ 77$\n\
                                                            I+\n';

	function getCharacters(art) {
		var i = art.length;
		// used to track the time at which the letter should print regardless of the current i (which is the character position including whitespace)
		var i_letter = 0;
		var s = ''; // string of whitespace
		var characters = [];
		do {
			i = (i + 1) % art.length;
			var c = art[i];

			var isWhitespace = /\s/.test(c);
			if (isWhitespace) {
				s += c;
				continue; // don't print the whitespace yet
			} else {
				if (s.length > 0) {
					c = s + c; // be sure to include the character currently being parsed
					s = '';
				}

				i_letter = (i_letter + 1) % art.length;

				characters.push(c);
			}
		}
		while (i);

		return characters;
	}

	var characters = getCharacters(art);

	var output = '';

	function printCharacterByIndex(characters, index, delay) {
		if (characters[index] === undefined) return;

		output += characters[index];
		console.clear();
		console.log(output)

		window.setTimeout(printCharacterByIndex.bind(null, characters, index + 1, delay), delay);
	}

	console.clear();
	printCharacterByIndex(getCharacters(art), 0, 100);


	App.init();
});
