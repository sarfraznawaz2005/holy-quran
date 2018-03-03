var chapters = null;
var $chapter = $('#chapter');
var $verse = $('#verse');
var $result = $('.result');
var $main = $('.main');
var $info = $('.info');
var $count = $('.count');
var $top = $('#top');
var $search = $('#search');
var $frmSearch = $('#frmSearch');
var $searchBtn = $('#searchBtn');

// get all chapters
function getChapters() {
    $.getJSON('./json/surah.json', function (response) {
        chapters = response;
        $.each(chapters, function (i, v) {
            $chapter.append('<option value="' + ++i + '">' + i + ' - ' + v.title + '</option>');
        });

        $chapter.attr('disabled', false);
    });
}

// read specific chapter
$chapter.on('change', function () {
    var chapter = this.value;
    var data = [];

    if (!chapter) {
        $count.text('00');
        $info.hide();
        $result.hide();
        $top.hide();
        return;
    };

    $.getJSON('./json/surah/surah_' + chapter + '.json', function (quran) {
        $.getJSON('./json/translation/en/en_translation_' + chapter + '.json', function (trans) {

            $verse.show();
            $count.show();
            $top.show();
            $verse.empty();
            $verse.append('<option value="">GoTo Verse</option>');
            $main.empty();

            $.each(trans.verse, function (i, v) {
                var verseNumber = i.replace(/\D/g, '');

                $verse.append('<option value="' + verseNumber + '">' + verseNumber + '</option>');

                var text = '<table width="100%">';
                text += '<tr>';
                text += '<td>';
                text += '<div rel="verse_' + verseNumber + '" class="arabic alert alert-warning">' + quran.verse[i] + '</div>';
                text += '<div class="trans alert alert-success">' + v + '</div>';
                text += '</td>';
                text += '<td rowspan="2" width="70" class="alert alert-success td_info"><span class="badge badge-primary">' + chapter + ':' + verseNumber + '</span></td>';
                text += '</tr>';
                text += '</table>';

                $main.append(text);
            });

            $info.text(chapter + ' - ' + quran.name);
            $count.text('Total Verses: ' + quran.count);
            $info.css('display', 'block');
            $result.css('display', 'block');
        });
    });
});

// go to verse
$verse.on('change', function () {
    if (!this.value) {
        return;
    };

    $("html, body").animate({ scrollTop: $('div[rel="verse_' + this.value + '"]').offset().top }, 1000);
});

// go to top
$top.on('click', function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
});

// search translation
$frmSearch.on('submit', function () {
    var counter = 1;
    var total = 0;
    var keyword = $search.val();

    if (!keyword) {
        return false;
    }

    $searchBtn.attr('disabled', true);

    $verse.hide();
    $main.empty();
    $info.show();
    $info.text('Search Results');
    $count.hide();
    $result.show();
    $top.show();

    while (counter <= 114) {
        (function (counter) {

            $.getJSON('./json/translation/en/en_translation_' + counter + '.json', function (trans) {
                $.each(trans.verse, function (i, v) {
                    if (v.indexOf(keyword) > -1 || v.toLowerCase().indexOf(keyword) > -1) {
                        $.getJSON('./json/surah/surah_' + counter + '.json', function (quran) {
                            total++;
                        
                            var verseNumber = i.replace(/\D/g, '');

                            var text = '<table width="100%">';
                            text += '<tr>';
                            text += '<td>';
                            text += '<div rel="verse_' + verseNumber + '" class="arabic alert alert-warning">' + quran.verse[i] + '</div>';
                            text += '<div class="trans alert alert-success">' + v + '</div>';
                            text += '</td>';
                            text += '<td rowspan="2" width="70" class="alert alert-success td_info"><span class="badge badge-primary">' + counter + ':' + verseNumber + '</span></td>';
                            text += '</tr>';
                            text += '</table>';

                            $info.text('Search Results (' + total + ')');
                            $searchBtn.attr('disabled', false);

                            $main.append(text);
                        });
                    }
                });
            });

        })(counter);

        counter++;
    }
    
    return false;

});

!chapters && getChapters();
