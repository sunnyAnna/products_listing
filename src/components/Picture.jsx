import React from 'react';

const Picture = function({image,name}){
	/**
	 * @description Creates a list of images for srcSet.
	 */
	let images = image.meta.map(function(item){
		if (item.hasOwnProperty('key')) {
			return item.key == 'medium' ? `${item.value} 400w` : item.key == 'large' ? `${item.value} 300w` : null
		}
		return
	})

	return (
		<img src={image.ref}
			alt={name}
			sizes="(min-width: 400px) 50vw, 100vw"
			srcSet={images}/>
	)
}

export default Picture
