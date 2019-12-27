
const $ = _ => document.querySelector(_)

const $c = _ => document.createElement(_)

const open = e => {
	if(e.target.files[0]){
		const imageSrc = e.target.files[0]
		const url = window.URL || window.webkitURL
		draw(url.createObjectURL(imageSrc))
	}
}

const draw = img => {
	$('#preview').style.backgroundImage = `url(${img})`
	$('#preview').style.backgroundRepeat = 'no-repeat'
	$('#preview').style.backgroundSize = 'contain'
	OCR(img)
}

const OCR = (img, lang = 'por+eng') => {
	const progress = $c('progress') 
	progress.value = 0
	progress.style.display = 'block'
	progress.style.margin = '25% auto'
	$('#recognizedText').appendChild( progress )
	
	Tesseract.recognize(
		img,
		lang,
		{
			logger: m => { progress.value = m.progress }
		})
	.then(({ data: { text } }) => {
		$('#recognizedText').style.padding = '1em'
		$('#recognizedText').innerText = text
	})
	.catch( e => { $('#recognizedText').innerText = e } )
}

$('#import').addEventListener('change', open )

window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);
	const title = parsedUrl.searchParams.get('title'),
				text = parsedUrl.searchParams.get('text'),
				url = parsedUrl.searchParams.get('url')
				
  if(title) alert('Title shared: ' + title);
  if(text) alert('Text shared: ' + text);
  if(url) alert('URL shared: ' + url);
  
});

if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/ocr/sw.js', {scope: './'})
           .then(response => response)
           .catch(reason => reason);
}

let deferredPrompt;
const addBtn = document.createElement('button');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  addBtn.style.display = 'block';
  addBtn.addEventListener('click', (e) => {
    addBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        deferredPrompt = null;
      });
  });
});

