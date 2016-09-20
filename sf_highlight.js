(function() {
	
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
					console.log(res[0]);
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
			if(lines[i].startsWith('[') && lines[i].endsWith(']'))
			{
				var span = document.createElement('span');
				span.className = 'k';
				span.innerHTML = lines[i]+'\n';
				pre.appendChild(span);
			}
		}
		if(codeType.value == 'yml'){
			
		}
		if(codeType.value == 'php'){
			if(lines[i].startsWith('//'))
			{
				var span = document.createElement('span');
				span.className = 'c1';
				span.innerHTML = lines[i]+'\n';
				pre.appendChild(span);
			}
		}
	}
	
	
	coderesult.appendChild(codehighlight);
	
}());