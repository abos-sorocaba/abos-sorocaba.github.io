let Admin = (() => {
	let Admin = {};
	let _ = document.querySelector.bind(document);
	let __ = name => '#' + name;
	let reference = {};
	let initial = null;
	let template = null;
	let images = [];
	let sum = 0;
	let timestamp;
	
	let toggleViewer = size => {
		(reference.viewer.classList[ size > 0 ? 'remove' : 'add' ])('hidden');
		(reference.text.classList[ size > 0 ? 'add' : 'remove' ])('hidden');
	}
	let removeItem = el => {
		el.parentNode.removeChild(el);
		toggleViewer(--sum);
	}

	Admin.upload = (text, viewer) => {
		reference.text = _(__(text));
		reference.viewer = _(__(viewer));
		reference.input.click();
	}

	Admin.update = function (ev) {
    if (!reference.input.files) return toggleViewer(-1);
    sum += reference.input.files.length;
    Array.from(reference.input.files).forEach(file => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(event) {
      	let el = template.cloneNode(true);
      	let img = el.querySelector('img');
      	img.setAttribute('src', event.target.result);
      	images.push({ file, data: event.target.result });
      	el.querySelector('.remove').onclick = ev => removeItem(el);
      	reference.viewer.insertBefore(el, reference.viewer.firstChild);
      }
    });
		toggleViewer(sum);
	}

	Admin.init = id => {
		initial = id;
		reference.input = _(__(id));
		reference.input.addEventListener('change', Admin.update);
		_(__('form')).addEventListener('submit', Admin.submit)
		let node = _('[data-template]');
		template = node.cloneNode(true);
		node.parentNode.removeChild(node);
	}

	Admin.submit = event => {
		event.preventDefault();
		let form = event.target
		let API = 'http://localhost:3000/github'

		let method = (type, url, data, callback) => $.ajax({
			url: url,
			method: type,
			data: typeof data === 'function' ? '{}' : JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: typeof data === 'function' ? data : callback,
			error: (XMLHttpRequest, textStatus, errorThrown) => console.log(XMLHttpRequest, textStatus, errorThrown)
		})

		let create = params => method('POST', API, params, data => console.log(data))

		let post = () => {
			let content = form.content.value
				, title = form.title.value
				, subtitle = form.subtitle.value;
			let _data = {content, title, subtitle, images}
			method('POST', API + '/post', { content: _data }, data => console.log(data));
		}

		post()

		return false;
	}

	return Admin;
})();