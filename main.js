
var Swiper = require('swiper');
var flexforever = require('flexforever');
var Emitter = require('emitter');
var events = require('events');
var classes = require('classes');

module.exports = flexIEC; 

var uSwipeID = 0;

var removeChildren = function(div)
{
	//we clear out the previous occupants
	var fc = div.firstChild;

	while( fc ) {
	    div.removeChild( fc );
	    fc = div.firstChild;
	}
}

var createDiv = function(id, classes, type, inner)
{
	if(!type)
		type = 'div';

	var element = document.createElement(type);

	//set our ID
	element.id = id;
	
	element.className = classes;

	if(inner)
		element.innerHTML = inner;

	return element;
}

var createLoadingDiv = function(id, classes)
{
	var element = createDiv(id, "loading");
	
	//add class information if we have it
	if(classes)
		element.className += " " + classes;

	return element;
}


var createParentContainer = function(id, classes)
{
	var element = document.createElement('div');
	
	//set our ID
	element.id = id;
	
	element.className = "parent-cell";

	//add class information if we have it
	if(classes)
		element.className += " " + classes;


	return element;
}

var createRow = function(id, additionalClasses)
{
	return createDiv(id, "row mOR" + (additionalClasses ? (" " + additionalClasses) : "")) ;
}

function testHeight(a, divValue) {

    a.style.visibility = "hidden";
    a.style.overflow = "auto";
    divValue.appendChild(a);

    var children = a.children;
    for(var i=0; i < children.length; i++)
    {
    	console.log('', i, ' height: ', children[i].offsetHeight);
    }

    var height = a.offsetHeight;
    console.log('h: ', height, ' or: ', a.clientHeight, ' or ', a.scrollHeight);
    //get rid of this hidden object -- we don't need it anymore
    divValue.removeChild(a);

    return height;
}
var evoWrapHeight = 47;
function createEvoWrap(eID)
{
	var bottomRow = createDiv(eID + "-bot", "row mOR border");
	bottomRow.style.height = evoWrapHeight + "px";

	return bottomRow;
}

function createGenericButtons(eID)
{
	return {"like" : createDiv(eID + "-like", "col-auto pOR border", "div", "like"), "publish" : createDiv(eID + "-publish", "col-auto pOR border", "div", "pub")};
}




function flexIEC()//divValue, reqOptions)
{
	// console.log(divValue);

	var self = this;

	self.eventManager = {};

	Emitter(self);

	//lets subdivide our div object according to function

	self.injectIEC = function(divValue, reqOptions)
	{
		reqOptions = reqOptions || {};
		//deep clone the options before sending it in
		reqOptions = JSON.parse(JSON.stringify(reqOptions));

		var container = createDiv("test", "container fullWH pOR");	
		var row = createRow("test", "fullWH");

		//this holds all parent info
		var parentColumn = createDiv("parent-col", "col-xs-3 fullWH colObject border mOR pOR");

		var parentTopRow = createDiv("p-top", "");

		var choice = createDiv("p-top-choice", "border");
		choice.innerHTML = "Parent Artifacts";

		//add the choice object to our top row (to have something to display)
		parentTopRow.appendChild(choice);

		var parentBottomRow = createDiv("p-bot", "innerObject colObject");
		var innerParent = createDiv("p-inner", "innerObject special");
		// innerParent.style.flex = 1;
		parentBottomRow.appendChild(innerParent);

		//append both top and bottom to our children
		parentColumn.appendChild(parentTopRow);
		parentColumn.appendChild(parentBottomRow);
		//add parent to the second row
		// leftParentRow.appendChild(parentColumn);
		
	 
		var rightColumn = createDiv("evo-col", "col-auto fullWH colObject border mOR pOR")

		// var evoTopColumn = createDiv("p-top", "");

		// var choice = createDiv("p-top-choice", "border");
		// choice.innerHTML = "Parent Artifacts";
		var tabs = createDiv("evoTabs", "tabs row mOR");
		
		var aRef = createDiv("", "active col-auto border", "a", "IEC");
		aRef.href = "#";
		tabs.appendChild(aRef);
		
		aRef = createDiv("", "col-auto border", "a", "Novelty");
		aRef.href = "#";
		tabs.appendChild(aRef);

		aRef = createDiv("", "col-auto border", "a", "Fitness");
		aRef.href = "#";
		tabs.appendChild(aRef);   

		var evoBottom = createDiv("evo-bot", "innerObject colObject");
		var innerEvo = createDiv("evo-inner", "innerObject special");
		evoBottom.appendChild(innerEvo);

		rightColumn.appendChild(tabs);
		rightColumn.appendChild(evoBottom);

		//<div class="tabs"> <a href="#" class="active">Tab 1</a> <a href="#" style="margin:0 17px">Tab 2</a> <a href="#">Tab 3</a> </div>

		//append both children
		row.appendChild(parentColumn);
		row.appendChild(rightColumn);

		container.appendChild(row);

		//then pull in the full containers
		divValue.appendChild(container);

		//add in our inner slide objects
		self.addEvoFlexToPage("parent", innerParent, {objectSize: reqOptions.objectSize, mode: 'vertical', extraHeightPerObject: evoWrapHeight});
		self.addEvoFlexToPage("iec", innerEvo, {objectSize: reqOptions.objectSize, extraHeightPerObject: evoWrapHeight});  
	}

	


	self.likeElement = function(e)
	{
		var elementID = e.target.id.replace(/-like/g, "");
		var el = document.getElementById(elementID);
		console.log("Like: ", elementID, " el: ", el);

		classes(el).toggle('like'); 

		//we toggle adding this to our parent objects
	}

	self.publishElement = function(e)
	{
		console.log("Pub: ", e.target.id.replace(/-publish/g, ""));
	}

	self.finishElementCreated = function(eID, eDiv)
	{
		//stop the loading of this object
		// console.log('Stop it! ', eID, ' div: ', eDiv);
		
		var c = classes(eDiv);
		if(c.has('loading'))
			c.toggle('loading');

		for(var i=0; i < eDiv.children.length; i++)
		{	
			var c = classes(eDiv.children[i]);
			if(c.has('loading'))
				c.toggle('loading');
		}
	}

	self.createGenericIndividual = function(eID)
	{
		var external = createDiv(eID + "-wrap", "colObject");

		var loading = createLoadingDiv(eID + "-object", "innerObject");

		//add the customary piece
		var bottomRow = createEvoWrap(eID);
		var bottomButtons = createGenericButtons(eID);
		
		bottomRow.appendChild(bottomButtons.like);
		bottomRow.appendChild(bottomButtons.publish);

		external.appendChild(loading);
		external.appendChild(bottomRow);

		return {individual: loading, full: external, buttons: bottomButtons};
	} 

	self.addEvoFlexToPage = function(flexName, divToAppend, addOptions)
	{
		var flexOptions =  
		{
			objectSize: {width: 250, height: 200, rowMargin: 4},
			// mode: 'vertical' ,
			width : 500
		};

		addOptions = addOptions || {};
		
		for(var key in addOptions)
			flexOptions[key] = addOptions[key];

		var nf = new flexforever(divToAppend, flexOptions);

	
		nf.on('elementCreated', function(eID, eDiv)
		{
			// console.log('EVisible id: ', eID, " div: ", eDiv);
			// element.className += "grid-cell";	
			var elementObj = createGenericIndividual(eID);

			var likeManager = events(elementObj.buttons.like, self);
			var pubManager = events(elementObj.buttons.publish, self);

			self.eventManager[eID] = {like: likeManager, publish: pubManager};

			likeManager.bind('click', 'likeElement');
			pubManager.bind('click', 'publishElement');

			eDiv.appendChild(elementObj.full);

			self.emit('createIndividual', flexName, eID, elementObj.individual, self.finishElementCreated);

		});

		//when things are shown, pass it along
		nf.on('elementVisible', function(eID, eDiv)
		{
			// console.log('evis emit- ', eID, eDiv);
			self.emit('visibleIndividual', eID, document.getElementById(eID + "-object"));
			// self.emit('elementVisible', eID, eDiv);
			// element.className += "grid-cell";
			//removeChildren(eDiv);
		});


		//when things are hidden, pass it along
		nf.on('elementHidden', function(eID, eDiv)
		{
			// console.log('ehid emit');
			self.emit('hiddenIndividual', eID, document.getElementById(eID + "-object"));

			// self.emit('elementHidden', eID, eDiv);
			// element.className += "grid-cell";
			//removeChildren(eDiv);
		});

		nf.createNewPage();
	}

	// var oAddHeight = testHeight(createEvoWrap("hidden-test"), divValue);
	// console.log('Height to add: ', oAddHeight);
	// self.addFlexToPage(parentColumn, {mode: 'vertical'});




	// var element = createLoadingDiv("demo", "demo");

	// console.log("E: ", element);


	//add the little bugger to the inside of the div
	// divValue.appendChild(element);

	// if(!reqOptions || !reqOptions.objectSize || !reqOptions.objectSize.width || !reqOptions.objectSize.height)
		// throw new Error("Can't use flexIEC without options or objectSize");

	//add emitter properties to this object


	//send us back please, we've got precious events to hook into
	return self;
}
