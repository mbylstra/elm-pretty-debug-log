Elm.Native.PrettyDebug = {};
Elm.Native.PrettyDebug.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.PrettyDebug = localRuntime.Native.PrettyDebug || {};
	if (localRuntime.Native.PrettyDebug.values)
	{
		return localRuntime.Native.PrettyDebug.values;
	}
	if ('values' in Elm.Native.PrettyDebug)
	{
		return localRuntime.Native.PrettyDebug.values = Elm.Native.PrettyDebug.values;
	}

	// var List = Elm.Native.List.make(localRuntime);
	// var Maybe = Elm.Maybe.make(localRuntime);
  // var Utils = Elm.Native.Utils.make(localRuntime);
  // var _toPrettyString = Utils._toPrettyString;

  // function toPrettyHtmlString(something) {
  //   return _toPrettyString(something);
  // }

  var _Array;
	var Dict;
	var List;
  var INDENT_SPACES = 2;

  var renderLine = function(s, depth) {
    var spaces = "";
    for (var i = 0; i < (depth * INDENT_SPACES); i++) {
      spaces += " ";
      // out += "!";
    }
    return '\n' + spaces + s;
  }

	var _toPrettyString = function(v, depth)
	{
		var type = typeof v;
		if (type === 'function')
		{
			var name = v.func ? v.func.name : v.name;
			return renderLine('<function' + (name === '' ? '' : ': ') + name + '>', depth);
		}
		else if (type === 'boolean')
		{
			return renderLine(v ? 'True' : 'False', depth);
		}
		else if (type === 'number')
		{
			return renderLine(v + '', depth);
		}
		else if ((v instanceof String) && v.isChar)
		{
			return renderLine('\'' + addSlashes(v, true) + '\'', depth);
		}
		else if (type === 'string')
		{
			return renderLine('"' + addSlashes(v, false) + '"', depth);
		}
		else if (type === 'object' && 'ctor' in v)
		{
			if (v.ctor.substring(0, 6) === '_Tuple')
			{
				var output = [];
				for (var k in v)
				{
					if (k === 'ctor') continue;
					output.push(_toPrettyString(v[k], depth + 1));
				}
				return renderLine('(' + output.join(',') + ')', depth);
			}
			else if (v.ctor === '_Array')
			{
				if (!_Array)
				{
					_Array = Elm.Array.make(localRuntime);
				}
				var list = _Array.toList(v);
				return 'Array.fromList ' + _toPrettyString(list, depth + 1);
			}
			else if (v.ctor === '::')
			{
				var output = renderLine('[ ' + _toPrettyString(v._0, depth + 1), depth);
				v = v._1;
				while (v.ctor === '::')
				{
					output += renderLine(', ' + _toPrettyString(v._0, depth + 1, depth));
					v = v._1;
				}
				return renderLine(output + ']', depth);
			}
			else if (v.ctor === '[]')
			{
				return '[]';
			}
			else if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin' || v.ctor === 'Set_elm_builtin')
			{
				if (!Dict)
				{
					Dict = Elm.Dict.make(localRuntime);
				}
				var list;
				var name;
				if (v.ctor === 'Set_elm_builtin')
				{
					if (!List)
					{
						List = Elm.List.make(localRuntime);
					}
					name = 'Set';
					list = A2(List.map, function(x) {return x._0; }, Dict.toList(v._0));
				}
				else
				{
					name = 'Dict';
					list = Dict.toList(v);
				}
				return name + '.fromList ' + _toPrettyString(list, depth + 1);
			}
			else if (v.ctor.slice(0, 5) === 'Text:')
			{
				return '<text>';
			}
			else if (v.ctor === 'Element_elm_builtin')
			{
				return '<element>'
			}
			else if (v.ctor === 'Form_elm_builtin')
			{
				return '<form>'
			}
			else
			{
        // Tagged Union
				var output = '';
				for (var i in v)
				{
					if (i === 'ctor') continue;
					var str = _toPrettyString(v[i], depth + 1);
					var parenless = str[0] === '{' || str[0] === '<' || str.indexOf(' ') < 0;
					output += ' ' + (parenless ? str : '(' + str + ')');
				}
				return renderLine(v.ctor + output, depth);
			}
		}
		else if (type === 'object' && 'notify' in v && 'id' in v)
		{
			return '<signal>';
		}
		else if (type === 'object')
		{
			var output = [];
			for (var k in v)
			{
				output.push(k + ' = ' + _toPrettyString(v[k], depth));
			}
			if (output.length === 0)
			{
				return '{}';
			}
			return '{ ' + output.join(', ') + ' }';
		}
    else if (type === 'undefined')
    {
    	return "undefined (Must be an error from a Native module)";
    }
    else
    {
    	return '<internal structure>';
    }
	};

  function log(tag, value)
	{

    var styles =
    {
      tag:
        "line-height: 25px;"
        + "color: white;"
        + "background-color: #60B5CC;"
        + "border-radius: 2px;"
        + "padding-top: 2px;"
        + "padding-bottom: 2px;"
        + "padding-right: 5px;"
        + "padding-left: 5px;"
      , data:
        ""
        // "color: #ccc;"
        // + "background-color:#484848;"
        // + "border-radius:2px;"
        // + "padding: 4px;"
        // + "margin: 20px;"
        // + "border: 1px solid blue;"
        // + "display: block;"
        // + "position: absolute;"
    }

		var msg = '%c' + tag + ':\n%c' + toPrettyString(value);
		var process = process || {};
		if (process.stdout)
		{
			process.stdout.write(msg);
		}
		else
		{
			console.log(msg, styles.tag, styles.data);
			// console.log(msg);
		}
		return value;
	}

  function toPrettyString(v)
  {
    return _toPrettyString(v, 0);
  }

  function addSlashes(str, isChar)
	{
		var s = str.replace(/\\/g, '\\\\')
				  .replace(/\n/g, '\\n')
				  .replace(/\t/g, '\\t')
				  .replace(/\r/g, '\\r')
				  .replace(/\v/g, '\\v')
				  .replace(/\0/g, '\\0');
		if (isChar)
		{
			return s.replace(/\'/g, '\\\'');
		}
		else
		{
			return s.replace(/\"/g, '\\"');
		}
	}

	Elm.Native.PrettyDebug.values = {
		_toPrettyString: _toPrettyString,
		log: F2(log),
	};

	return localRuntime.Native.PrettyDebug.values = Elm.Native.PrettyDebug.values;
};
