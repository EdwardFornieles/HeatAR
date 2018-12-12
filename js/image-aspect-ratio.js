/**
 * Originally wrote this snippet for Suffragette/Pathé campaign (https://apps.facebook.com/inspiring-women)
 * 
 * The campaign app forms a grid of square images pulled from social APIs based on
 * particular hashtags. This snippet sets the new width and
 * height based on their natural width and height to maintain the aspect ratio.
 * Works best for 1:1 aspect ratio but can be modified to accommodate other ratio.
 * 
 * @param Element|Resource img - An image element/resource from DOM
 * @param int expected - Expected width or height
 */
 
  function setAspectRatio(img, expected) {
    
	// No support for IE8 and lower
	if ( img.naturalWidth === 'undefined' ) return;
	
	// Get natural dimensions of image
	var width = img.naturalWidth;
	var height = img.naturalHeight;
	
	// Examine if width is larger than height then reduce the width but fix the height
	if ( width > height ) {
		img.style.width = (width / height * expected) + 'px';
		img.style.height = expected + 'px';
		
		// horizontally center the image
		img.style.transform = 'translatex(-' + parseInt((width / height * expected) - expected) + 'px)';
		img.style.webkitTransform = 'translateX(-' + parseInt((width / height * expected) - expected) + 'px)';
		return img;
	}
	
	// Examine if height is larger than width then reduce the height but fix the width
	else if ( height > width ) {
		img.style.width = expected + 'px';
		img.style.height = (height / width * expected) + 'px';
		
		// vertically center the image
		img.style.transform = 'translateY(-' + parseInt((height / width * expected) - expected) + 'px)';
		img.style.webkitTransform = 'translateY(-' + parseInt((height / width * expected) - expected) + 'px)';
		return img;
	}
	
	// Or return fix width and height
	else {
		img.style.width = expected + 'px';
		img.style.height = expected + 'px';
	}
}