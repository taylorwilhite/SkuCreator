function selectAll(source){
	checkboxes = document.getElementsByName('size[]');
	for(var i=0; i<checkboxes.length; i++) {
    checkboxes[i].checked = source.checked;
  }
}