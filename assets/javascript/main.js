$(() => {
  const endpoint = 'http://gateway.marvel.com/v1/public/characters'
  const key = '6dd581e143d4eb3659beaa6938688fbe'
  const hash = '1ca31a5c14f545b403a90d70b1a14b70'
  const timestamp = '1'
  const limit = 100
  const thumbs = $('.thumbnail')
  characters = []

  /*
    Event handling
  */
  $('#submit').click(() => getCharacters())
  $('#searchtext').keypress(event => event.keyCode === 13 ? getCharacters() : true)
  $(window).resize(() => thumbs.css('height', thumbs.css('width')))

  /*
    Request handling
  */
  let writeNoResults = () => !$('#characters').html("<h3>No results.</h3>")

  function getCharacters() {

    let [html, imgs] = ['', {}]

    let term = $('#searchtext').val()
    let request = `${endpoint}?nameStartsWith=${term}&` +
                              `limit=${limit}&`         +
                              `ts=${timestamp}&`        +
                              `apikey=${key}&`          +
                              `hash=${hash}`

    $.get(request, response => {

      let result = response.data.results

      if(R.isEmpty(result)) return writeNoResults()

      $.each(result, (_, character) => {

        // console.log(character)
        
        wiki = character.urls.find(link => link.type === "wiki")

        if(!R.isNil(wiki) && !/image_not_available/.test(character.thumbnail.path) && /\/f\//.test(character.thumbnail.path)) {

          characters.push(character)

        }

      })

      console.log(characters) ///////////////////////////////////////////////////////////////////////////////////////////
      if(R.isEmpty(characters)) return writeNoResults()

      $.each(characters, (_, character) => {
        let [name, subtext] = character.name.split(/ \((.+?)\)/)
        html += `<a href="${wiki.url}" title="${character.name}" id="${character.id}" class="thumbnail col-md-4">
                    <figcaption>
                      ${name}
                      <div>${subtext || '&nbsp;'}</div>
                    </figcaption>
                  </a>`
        imgs[`${character.id}`] = `${character.thumbnail.path}.${character.thumbnail.extension}`
      })

      $('#characters').html(html)

      $.each(imgs, (id, url) => {
        $(`#${id}`).css('background-image', `url("${url}")`)
                   .css('height', $(`#${id}`).css('width'))
      })

    })

  }

})