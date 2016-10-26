(function() {
	
	var phpcodestr = [ 'namespace','use','public','class','function','foreach', 'echo', 'endforeach', 'as', 'array', '=\&gt;', 'new', 'if', 'else', 'print_r','return' ]
	var is_tag_open = false;

	var getFromBetween = {
		results:[],
		string:"",
		getFromBetween:function (sub1,sub2) {
			if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
			var SP = this.string.indexOf(sub1)+sub1.length;
			var string1 = this.string.substr(0,SP);
			var string2 = this.string.substr(SP);
			var TP = string1.length + string2.indexOf(sub2);
			return this.string.substring(SP,TP);
		},
		removeFromBetween:function (sub1,sub2) {
			if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
			var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
			this.string = this.string.replace(removal,"");
		},
		getAllResults:function (sub1,sub2) {
			// first check to see if we do have both substrings
			if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

			// find one result
			var result = this.getFromBetween(sub1,sub2);
			// push it to the results array
			this.results.push(result);
			// remove the most recently found one from the string
			this.removeFromBetween(sub1,sub2);

			// if there's more substrings
			if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
				this.getAllResults(sub1,sub2);
			}
			else return;
		},
		get:function (string,sub1,sub2) {
			this.results = [];
			this.string = string;
			this.getAllResults(sub1,sub2);
			return this.results;
		}
	};

	function spacePad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join(" ") + num;
	}
	
	function Phpcode( code ) {
		code = code.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		
		for(k in phpcodestr) {
			regex = new RegExp( ' '+ phpcodestr[k]+' ', "g");
			code = code.replace(regex, ' <span class="k">'+ phpcodestr[k] +'</span> ');
		}
		
		for(k in phpcodestr) {
			regex = new RegExp( phpcodestr[k]+' ', "g");
			code = code.replace(regex, '<span class="k">'+ phpcodestr[k] +'</span> ');
		}
		for(k in phpcodestr) {
			if(phpcodestr[k] == code) {
				code = code.replace(code, '<span class="k">'+ code +'</span> ');
			}
		}
		
		var res = code.match(/\(/g);
		if(res != null && res.length > 0 && !code.trim().endsWith('();'))
		{
			code = code.replace(/\(/g, '<span class="p">(</span>');
		}
		res = code.match(/\)/g);
		if(res != null && res.length > 0)
		{
			if(code.trim().endsWith('();')) {
				code = code.replace('();','').replace(/\)/g, '<span class="p">)</span>')+'();';
			} else if(code.trim().endsWith(');'))
			{
				code = code.replace(');','').replace(/\)/g, '<span class="p">)</span>')+');';
			} else {
				code = code.replace(/\)/g, '<span class="p">)</span>');
			}
		}
		res = code.match(/,/g);
		if(res != null && res.length > 0 && !code.trim().endsWith('();'))
		{
			code = code.replace(/,/g, '<span class="p">,</span>');
		}
		res = code.match(/\{/g);
		if(res != null && res.length > 0 && !code.trim().endsWith('();'))
		{
			code = code.replace(/\{/g, '<span class="p">{</span>');
		}
		res = code.match(/\}/g);
		if(res != null && res.length > 0 && !code.trim().endsWith('();'))
		{
			code = code.replace(/\}/g, '<span class="p">}</span>');
		}
		// endings
		if(code.trim().endsWith('();')){
			code = code.replace('();', '<span class="p">();</span> ');
		}
		else if(code.trim().endsWith(');')){
			code = code.replace(');', '<span class="p">);</span> ');
		}
		else if(code.trim().endsWith(';')){
			//code = code.replace(';', '<span class="p">;</span> ');
		}
		//code = code.replace('[^);]', '<span class="k">);</span> ');
		return code;
	}

	if (typeof self === 'undefined' || !self.document) {

		console.log('ajillax bolomjgui bn!!!');
		return;
	}

	var codeType = document.getElementById("codeType");
	var textArea = document.getElementById("RawCodeInput");
	var coderesult = document.getElementById("code-result");

	var lines = textArea.value.split("\n"); // arrayOfLines is array where every element is string of one line
	
	

	var codehighlight = document.createElement('div');
	codehighlight.className = 'literal-block notranslate';

	var codehighlighttype = document.createElement('div');
	//codehighlighttype.className = 'highlight-bash';
	codehighlighttype.className = 'highlight-php';
	//codehighlighttype.className = 'highlight-twig';

	codehighlight.appendChild(codehighlighttype);

	var highlighttable = document.createElement('table');
	highlighttable.className = 'highlighttable';
	codehighlighttype.appendChild(highlighttable);

	var tbody = document.createElement('tbody');
	highlighttable.appendChild(tbody);

	var tr = document.createElement('tr');
	tbody.appendChild(tr);

	var td = document.createElement('td');
	td.className = 'linenos';
	tr.appendChild(td);

	var linenodiv = document.createElement('div');
	linenodiv.className = 'linenodiv';
	td.appendChild(linenodiv);

	var pre = document.createElement('pre');
	linenodiv.appendChild(pre);

	for(var i = 0;i < lines.length;i++){

		pre.innerHTML += spacePad(i+1, lines.length.toString().length)+'\n'; // " 5";
	}

	td = document.createElement('td');
	td.className = 'code';
	tr.appendChild(td);

	var highlight = document.createElement('div');
	highlight.className = 'highlight';
	td.appendChild(highlight);

	pre = document.createElement('pre');
	highlight.appendChild(pre);



	for(var i = 0;i < lines.length;i++){
		//code here using lines[i] which will give you each line

		if(codeType.value == 'bush'){
			if(lines[i].startsWith('#'))
			{
				var span = document.createElement('span');
				span.className = 'c';
				span.innerHTML = lines[i]+'\n';
				pre.appendChild(span);
			}

			if(lines[i].startsWith('$ '))
			{
				pre.innerHTML += lines[i].replace('$ ','<span class="nv" style="-webkit-user-select: none;">$ </span>')+'\n';
			}

			if(!lines[i].startsWith('$ ') && !lines[i].startsWith('#'))
			{
				var obj = getFromBetween.get(lines[i],'"','"');
				var str = lines[i];

				for(j in obj){
					var regex = new RegExp('"'+ obj[j].replace('(','\\(').replace(')','\\)')+'"', "g");
					str = str.replace(regex, '<span class="s2">"' + obj[j] + '"</span>');
				}

				pre.innerHTML += str.replace('\\>','<span class="se" style="-webkit-user-select: none;">\\></span>')+'\n';
			}
		}
		if(codeType.value == 'xml'){
			if(lines[i].trim().startsWith('<!--') && lines[i].endsWith('-->'))
			{
				var span = document.createElement('span');
				span.className = 'c';
				span.innerHTML = lines[i].replace('<','&lt;').replace('>','&gt;')+'\n';
				pre.appendChild(span);
			}

			if(lines[i].trim().startsWith('<?') && lines[i].endsWith('?>'))
			{
				var span = document.createElement('span');
				span.className = 'cp';
				span.innerHTML = lines[i].replace('<','&lt;').replace('>','&gt;')+'\n';
				pre.appendChild(span);
			}

			if( !(lines[i].trim().startsWith('<?') && lines[i].endsWith('?>')) && !(lines[i].trim().startsWith('<!--') && lines[i].endsWith('-->')) )
			{
				var obj = getFromBetween.get(lines[i],'"','"');
				var str = lines[i].replace(/</g,'&lt;').replace(/>/g,'&gt;');

				for(j in obj){
					regex = new RegExp('"'+ obj[j].replace('(','\\(').replace(')','\\)')+'"', "g");

					str = str.replace(regex, '<span class="s">"' + obj[j] + '"</span>');
				}

				var res = str.match(/\&lt;\s*\w* /g);
				if(res != null){
					str = str.replace(res[0],'<span class="nt">'+ res[0] +'</span>' );
				}
				res = str.match(/\&lt;\/\s*\w*\&gt;/g);
				if(res != null){
					str = str.replace(res[0],'<span class="nt">'+ res[0] +'</span>' );
				}

				pre.innerHTML += str +'\n';
			}
		}
		if(codeType.value == 'ini'){
			if(lines[i].startsWith('#'))
			{
				var span = document.createElement('span');
				span.className = 'c';
				span.innerHTML = lines[i]+'\n';
				pre.appendChild(span);
			}
			else if(lines[i].startsWith('[') && lines[i].endsWith(']'))
			{
				var span = document.createElement('span');
				span.className = 'k';
				span.innerHTML = lines[i]+'\n';
				pre.appendChild(span);
			}
			else
			{
				var res = lines[i].match(/[^ ]*/);
				var rightTxt = lines[i].substring( lines[i].lastIndexOf(" = ") + 3, lines[i].length);
				pre.innerHTML += lines[i]
				.replace(res[0], '<span class="na">'+ res[0] +'</span>')
				.replace(rightTxt, '<span class="s">'+ rightTxt +'</span>')
				.replace(" = ", ' <span class="o">=</span> ')
				+'\n';
			}
		}
		if(codeType.value == 'html'){
			
			var str = lines[i].replace(/</g,'&lt;').replace(/>/g,'&gt;');
			if(str.startsWith('//'))
			{
				var span = document.createElement('span');
				span.className = 'c1';
				span.innerHTML = str+'\n';
				pre.appendChild(span);
			} else {
				var res = str.match(/\&lt;\s*\w* /g);
				for(j in res){
					if(res[j] != null){
						str = str.replace(res[j],'<span class="nt">'+ res[j].trim() +'</span> ' );
					}
				}
				
				res = str.match(/\&lt;\s*\w*\&gt;/g);
				for(j in res){
					if(res[j] != null){
						str = str.replace(res[j],'<span class="nt">'+ res[j] +'</span>' );
					}
				}
				
				res = str.match(/\&lt;\/\s*\w*\&gt;/g);
				for(j in res){
					if(res[j] != null){
						str = str.replace(res[j],'<span class="nt">'+ res[j] +'</span>' );
					}
				}
				
				if(str.trim().startsWith("&lt;?php") && str.endsWith("?&gt;")) {
					str = Phpcode(str);
				} else if(str.trim().startsWith("&lt;?php")) {
					is_tag_open = true;
				} else if(str.endsWith("?&gt;")) {
					is_tag_open = false;
				}
				
				if (is_tag_open == true) {
					str = Phpcode( str );
				}
				
				var obj = getFromBetween.get(lines[i],'"','"');
				
				for(j in obj) {
					regex = new RegExp('"'+ obj[j].replace(/</g,'\\&lt;').replace(/>/g,'\\&gt;').replace(/\?/g,'\\?').replace(/\$/g,'\\$').replace('(','\\(').replace(')','\\)')+'"', "g");
					if(obj[j].startsWith("<?php") && obj[j].endsWith("?>")){
						str = str.replace(regex, '<span class="s">"</span>' + Phpcode( obj[j] ) + '<span class="s">"</span>');
					} else {
						str = str.replace(regex, '<span class="s">"' + obj[j] + '"</span>');
					}
				}
				
				pre.innerHTML += str
				.replace(/&lt;!DOCTYPE html&gt;/, '<span class="cp">&lt;!DOCTYPE html&gt;</span>')
				.replace(/\&lt;\?php/g, '<span class="cp">&lt;?php</span>')
				.replace(/\?\&gt;/g, '<span class="cp">?&gt;</span>')
				+'\n';
			}
		}
		if(codeType.value == 'php'){
			
			var str = lines[i].replace(/</g,'&lt;').replace(/>/g,'&gt;');
			if(str.trim().startsWith('//'))
			{
				var span = document.createElement('span');
				span.className = 'c1';
				span.innerHTML = str+'\n';
				pre.appendChild(span);
			} else {
				
				if(str.trim().startsWith("&lt;?php") && str.endsWith("?&gt;")) {
					str = Phpcode(str);
				} else if(str.trim().startsWith("&lt;?php")) {
					is_tag_open = true;
				} else if(str.endsWith("?&gt;")) {
					is_tag_open = false;
				}
				
				if (is_tag_open == true) {
					str = Phpcode( str );
				}
				
				var obj = getFromBetween.get(lines[i],'"','"');
				
				for(j in obj) {
					regex = new RegExp('"'+ obj[j].replace(/</g,'\\&lt;').replace(/>/g,'\\&gt;').replace(/\?/g,'\\?').replace(/\$/g,'\\$').replace('(','\\(').replace(')','\\)')+'"', "g");
					str = str.replace(regex, '<span class="s">"' + obj[j] + '"</span>');
				}
				
				var obj = getFromBetween.get(lines[i], "'","'");
				for(j in obj){
					regex = new RegExp("'"+ obj[j].replace(/</g,'\\&lt;').replace(/>/g,'\\&gt;').replace(/\?/g,'\\?').replace(/\$/g,'\\$').replace('(','\\(').replace(')','\\)')+"'", "g");
					
					str = str.replace(regex, '<span class="s">\'' + obj[j].replace(/</g,'\&lt;').replace(/>/g,'\&gt;') + '\'</span>');
				}
				
				pre.innerHTML += str
				.replace(/&lt;!DOCTYPE html&gt;/, '<span class="cp">&lt;!DOCTYPE html&gt;</span>')
				.replace(/\&lt;\?php/g, '<span class="cp">&lt;?php</span>')
				.replace(/\?\&gt;/g, '<span class="cp">?&gt;</span>')
				+'\n';
			}
		}
		if(codeType.value == 'twig'){
			var str = lines[i].replace(/</g,'&lt;').replace(/>/g,'&gt;');
			
			if(str.trim().startsWith('{#') && str.endsWith('#}'))
			{
				var span = document.createElement('span');
				span.className = 'c';
				span.innerHTML = str+'\n';
				pre.appendChild(span);
			} else if(str == ''){
				var span = document.createElement('span');
				span.className = 'x';
				span.innerHTML = str+'\n';
				pre.appendChild(span);
			} else {
				
				var res = str.match(/\&lt;\s*\w* /g);
				for(j in res){
					if(res[j] != null){
						str = str.replace(res[j],'<span class="nt">'+ res[j] +'</span>' );
					}
				}
				
				res = str.match(/\&lt;\s*\w*\&gt;/g);
				for(j in res){
					if(res[j] != null){
						console.log(res[j]);
						str = str.replace(res[j],'<span class="nt">'+ res[j] +'</span>' );
					}
				}
				
				res = str.match(/\&lt;\/\s*\w*\&gt;/g);
				for(j in res){
					if(res[j] != null){
						str = str.replace(res[j],'<span class="nt">'+ res[j] +'</span>' );
					}
				}
				
				var obj = getFromBetween.get(lines[i],'"','"');
				
				for(j in obj){
					regex = new RegExp('"'+ obj[j].replace('(','\\(').replace(')','\\)')+'"', "g");
					if(obj[j].includes("{{") || obj[j].includes("}}")){
						str = str.replace(regex, '<span class="s">"</span>' + obj[j] + '<span class="s">"</span>');
					} else {
						str = str.replace(regex, '<span class="s">"' + obj[j] + '"</span>');
					}
				}
				
				var span = document.createElement('span');
				span.className = 'x';
				span.innerHTML = str
				.replace(/&lt;!DOCTYPE html&gt;/, '<span class="cp">&lt;!DOCTYPE html&gt;</span>')
				.replace(/{{/g, '<span class="cp">{{</span>')
				.replace(/}}/g, '<span class="cp">}}</span>')
				.replace(/{%/g, '<span class="cp">{%</span>')
				.replace(/%}/g, '<span class="cp">%}</span>')
				+'\n';
				pre.appendChild(span);
			}
		}
		if(codeType.value == 'yml'){

		}
	}


	coderesult.appendChild(codehighlight);

}());
