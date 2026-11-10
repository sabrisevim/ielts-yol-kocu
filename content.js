/* IELTS Yol Koçu — content.
 * Exercise types:
 *   mcq   { q, options[], answer:index, why }
 *   gap   { q (use ___), answers[], why }              -> auto-checked (case/space-insensitive)
 *   build { tr, words[], answer, alts[], why }          -> tap words in order
 *   write { prompt, models[], focus }                   -> free typing, self-check against models
 */
window.CONTENT = {
  grammar: [
    {
      id: 'articles',
      title: 'Artikeller: a / an / the / Ø',
      emoji: '🅰️',
      ielts: 'Türk adayların 1 numaralı hatası. GRA kriterinde "sık hata" puanı Band 6\'da tutar. Task 1\'de "The graph shows...", Task 2\'de genel kavramlar artikelsiz.',
      explain: [
        'Tekil sayılabilir isim <b>tek başına duramaz</b>: <span class="wrong">Car is expensive.</span> → <span class="right">A car is expensive. / Cars are expensive.</span>',
        'Genel anlamda çoğul ya da sayılamayan isim → <b>artikel yok</b>: <i>Technology changes our lives.</i> (<span class="wrong">The technology</span>)',
        'Belirli, bilinen ya da tek olan → <b>the</b>: <i>the graph, the government, the internet</i>.',
        '<b>of</b> ile tanımlanınca genelde <b>the</b>: <i>the nature of education, the number of tourists</i>.',
        'Superlative ve sıra sayısıyla her zaman <b>the</b>: <i>the highest, the first</i>.'
      ],
      examples: [
        'The chart illustrates the proportion of people who used public transport.',
        'Unemployment is a serious problem in many countries.',
        'She works as an engineer at a defence company.'
      ],
      exercises: [
        { type: 'mcq', q: '___ unemployment is a serious problem in many countries.', options: ['The', 'An', 'Ø (artikel yok)'], answer: 2, why: 'Genel anlamda sayılamayan isim (unemployment) artikel almaz.' },
        { type: 'mcq', q: '___ graph illustrates the percentage of households with internet access.', options: ['A', 'The', 'Ø (artikel yok)'], answer: 1, why: 'Sınavda önüne konan, belirli grafik → The graph.' },
        { type: 'gap', q: 'In 2010, ___ number of tourists reached 5 million.', answers: ['the'], why: '"the number of" = sayısı (belirli bir değer). "a number of" = birçok.' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['Government should invest in the public transport.', 'The government should invest in public transport.', 'Government should invest in a public transport.'], answer: 1, why: '"The government" (o ülkenin hükümeti, belirli). "public transport" genel ve sayılamayan → artikelsiz.' },
        { type: 'build', tr: 'Teknoloji eğitimin doğasını değiştirdi.', words: ['Technology', 'has', 'changed', 'the', 'nature', 'of', 'education'], answer: 'Technology has changed the nature of education', why: 'Technology (genel) artikelsiz; "the nature of ..." of ile tanımlandığı için the.' },
        { type: 'gap', q: 'She is ___ engineer at a defence company.', answers: ['an'], why: 'Meslekler tekil sayılabilir → a/an. Sesli harf sesiyle başladığı için "an engineer".' },
        { type: 'mcq', q: 'Japan had ___ highest recycling rate of the five countries.', options: ['a', 'the', 'Ø (artikel yok)'], answer: 1, why: 'Superlative (en yüksek) her zaman "the" ister.' },
        { type: 'write', prompt: 'Türkçe → İngilizce: Bilim insanları iklim değişikliğinin insan faaliyetlerinden kaynaklandığına inanıyor.', models: ['Scientists believe that climate change is caused by human activities.'], focus: 'Scientists / climate change / human activities: hepsi genel anlamda → artikel yok.' }
      ]
    },
    {
      id: 'tenses',
      title: 'Zamanlar: Past Simple vs Present Perfect',
      emoji: '⏱️',
      ielts: 'Task 1\'de zaman seçimi tarihe bağlıdır. Paragraf içinde zaman tutarsızlığı en sık GRA hatalarından biridir.',
      explain: [
        'Geçmişte <b>bitmiş tarih</b> → Past Simple: <i>In 1990, sales <b>rose</b> to 2 million.</i>',
        'Geçmişten bugüne <b>süren</b> durum ya da sonucu önemli olan olay → Present Perfect: <i>Air travel <b>has become</b> more affordable over the last decade.</i>',
        '<b>since</b> + başlangıç noktası (since 2015), <b>for</b> + süre (for ten years).',
        'Task 1\'de gelecek tahmini: <i>is expected / projected / predicted <b>to reach</b></i>, ya da <i>will rise</i>.',
        '<span class="wrong">I have visited London in 2019.</span> Belirli bir geçmiş tarih varsa Present Perfect kullanılmaz.'
      ],
      examples: [
        'Between 2000 and 2010, the price of oil increased significantly.',
        'Over the past twenty years, online shopping has become extremely popular.',
        'By 2030, the figure is projected to reach 10 million.'
      ],
      exercises: [
        { type: 'mcq', q: 'Between 2000 and 2010, the price of oil ___ significantly.', options: ['increases', 'has increased', 'increased'], answer: 2, why: 'Bitmiş zaman aralığı (2000–2010) → Past Simple.' },
        { type: 'mcq', q: 'Over the past twenty years, online shopping ___ extremely popular.', options: ['became', 'has become', 'becomes'], answer: 1, why: '"Over the past ... years" bugüne kadar uzanır → Present Perfect.' },
        { type: 'gap', q: 'By 2030, the population is projected ___ 10 million. (reach)', answers: ['to reach'], why: 'is projected / expected / predicted + to + V1.' },
        { type: 'gap', q: 'The company has operated in Turkey ___ 2015.', answers: ['since'], why: 'Başlangıç noktası → since. Süre olsaydı for (for ten years).' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['I have visited London in 2019.', 'I visited London in 2019.', 'I have been visited London in 2019.'], answer: 1, why: 'Belirli geçmiş tarih (in 2019) → Past Simple.' },
        { type: 'build', tr: 'Uçak bileti fiyatları son yıllarda önemli ölçüde düştü.', words: ['Airfares', 'have', 'fallen', 'considerably', 'in', 'recent', 'years'], answer: 'Airfares have fallen considerably in recent years', alts: ['Airfares have considerably fallen in recent years', 'In recent years airfares have fallen considerably'], why: '"in recent years" bugüne kadar → Present Perfect (have fallen).' },
        { type: 'mcq', q: 'The figure ___ steady until 2005, after which it rose.', options: ['remained', 'has remained', 'remains'], answer: 0, why: 'Geçmişte bitmiş dönem (2005\'e kadar) → Past Simple.' },
        { type: 'write', prompt: 'Türkçe → İngilizce (Task 1 dili): 1990 ile 2000 arasında otomobil sahipliği iki katına çıktı, ancak o zamandan beri sabit kaldı.', models: ['Car ownership doubled between 1990 and 2000, but it has remained stable since then.'], focus: 'Bitmiş dönem → doubled (Past). "since then" bugüne uzanır → has remained (Present Perfect).' }
      ]
    },
    {
      id: 'trends',
      title: 'Eğilim ve Karşılaştırma Dili (Task 1)',
      emoji: '📈',
      ielts: 'Task 1\'in tamamı bu dille yazılır. Edat hataları (rose from/to/by) Task Achievement\'ı da etkiler çünkü veriyi yanlış aktarırsın.',
      explain: [
        'Fiil + zarf: <i>rose sharply, fell slightly, fluctuated, remained stable, peaked at, hit a low of</i>.',
        'Sıfat + isim: <i>a sharp rise <b>in</b> sales, a slight decline <b>in</b> the number of ...</i>',
        'Edatlar: rose <b>from</b> 20% <b>to</b> 35% (başlangıç/bitiş), rose <b>by</b> 15% (fark), peaked <b>at</b> 40% (değer).',
        'Karşılaştırma: <i>higher than, twice as high as, the highest, considerably more ... than</i>.',
        'Tekrardan kaçmak için: <i>the figure for Germany</i>, <i>that of women</i> (= the proportion of women).'
      ],
      examples: [
        'The number of passengers rose from 2 million to 3.5 million.',
        'There was a slight decline in the figure for Spain.',
        'While the proportion of men increased steadily, that of women declined.'
      ],
      exercises: [
        { type: 'mcq', q: 'The number of passengers rose ___ 2 million to 3.5 million.', options: ['by', 'from', 'at'], answer: 1, why: 'Başlangıç ve bitiş değeri verilirse from ... to ...' },
        { type: 'mcq', q: 'Sales increased ___ 15%, from 20% to 35%.', options: ['by', 'to', 'of'], answer: 0, why: 'Artış miktarı (fark) → by.' },
        { type: 'gap', q: 'There was a sharp rise ___ the number of students.', answers: ['in'], why: 'İsim kalıbı: a rise / fall / increase / decline IN something.' },
        { type: 'mcq', q: 'Coffee consumption in Italy was ___ that in the UK.', options: ['twice as high as', 'two times higher', 'double than'], answer: 0, why: 'Kalıp: twice / three times AS high AS.' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['The unemployment rate peaked in 12% in 2009.', 'The unemployment rate peaked at 12% in 2009.', 'The unemployment rate peaked to 12% in 2009.'], answer: 1, why: 'Zirve değeri → peak AT. Yıl → in 2009.' },
        { type: 'build', tr: 'Erkeklerin oranı istikrarlı biçimde artarken, kadınlarınki azaldı.', words: ['While', 'the', 'proportion', 'of', 'men', 'increased', 'steadily,', 'that', 'of', 'women', 'declined'], answer: 'While the proportion of men increased steadily, that of women declined', why: '"that of women" = the proportion of women. Tekrardan kaçınma Band 7 göstergesidir.' },
        { type: 'gap', q: 'The figure for Germany was considerably ___ than that for France. (low)', answers: ['lower'], why: 'Kısa sıfat + -er + than.' },
        { type: 'write', prompt: 'Aynı bilgiyi iki farklı yapıyla yaz (fiil+zarf ve sıfat+isim): "Satışlar 2015\'te keskin biçimde düştü."', models: ['Sales fell sharply in 2015.', 'There was a sharp fall in sales in 2015.'], focus: 'Yapı çeşitliliği = Grammatical Range. İki yapıyı dönüşümlü kullan.' }
      ]
    },
    {
      id: 'passive',
      title: 'Passive Voice (Süreç & Akademik Ton)',
      emoji: '⚙️',
      ielts: 'Task 1 süreç (process) diyagramlarında zorunludur. Task 2\'de nesnel, akademik ton sağlar: "It is widely believed that..."',
      explain: [
        'Yapı: <b>be + V3</b>. <i>is made / was built / has been shown / can be used / will be introduced</i>.',
        'Süreçte işi yapan kişi önemsiz: <i>The grapes <b>are harvested</b> and then <b>crushed</b>.</i>',
        'Akademik kalıplar: <i>It is often argued that... / It is widely believed that...</i>',
        'Sıralama kelimeleri: <i>First, Next, After that, Once ..., Finally</i>.',
        '<span class="wrong">will built</span> → <span class="right">will be built</span>. "be" unutulmaz.'
      ],
      examples: [
        'First, the raw materials are transported to the factory.',
        'Once the bricks have been shaped, they are dried for 48 hours.',
        'It is often argued that remote work increases productivity.'
      ],
      exercises: [
        { type: 'mcq', q: 'First, the raw materials ___ to the factory.', options: ['transport', 'are transported', 'are transporting'], answer: 1, why: 'Malzemeler taşınmaz, taşınır → passive (are + V3).' },
        { type: 'gap', q: 'Once the bricks have ___ , they are dried for 48 hours. (shape)', answers: ['been shaped'], why: 'Present Perfect passive: have + been + V3.' },
        { type: 'mcq', q: 'It ___ that remote work increases productivity.', options: ['is often argued', 'often argues', 'is often arguing'], answer: 0, why: 'Akademik kalıp: It is often argued that...' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['The new airport will built next year.', 'The new airport will be built next year.', 'The new airport will being built next year.'], answer: 1, why: 'Future passive: will + be + V3.' },
        { type: 'build', tr: 'Su filtrelenir ve ardından depolama tanklarına pompalanır.', words: ['The', 'water', 'is', 'filtered', 'and', 'then', 'pumped', 'into', 'storage', 'tanks'], answer: 'The water is filtered and then pumped into storage tanks', why: 'İkinci fiilde "is" tekrar edilmez: is filtered and (is) pumped.' },
        { type: 'gap', q: 'Strict rules should ___ to reduce air pollution. (introduce)', answers: ['be introduced'], why: 'Modal passive: should + be + V3.' },
        { type: 'mcq', q: 'Since 2010, more than 50 new schools ___ in the region.', options: ['have built', 'have been built', 'were build'], answer: 1, why: 'since → Present Perfect, okullar inşa edilir → have been built.' },
        { type: 'write', prompt: 'Aktif cümleyi pasife çevir (akademik ton): "Governments spend huge amounts of money on space exploration."', models: ['Huge amounts of money are spent on space exploration.', 'Huge amounts of money are spent on space exploration by governments.'], focus: 'Nesne başa geçer + are spent. "by governments" çoğu zaman gereksizdir.' }
      ]
    },
    {
      id: 'relative',
      title: 'Relative Clauses (Karmaşık Cümle)',
      emoji: '🔗',
      ielts: 'Band 7 GRA için "a variety of complex structures" gerekir. Relative clause bunun en kolay yoludur. Türkçe\'deki "-en / -dığı" yapıları buna karşılık gelir.',
      explain: [
        '<b>who</b> (insan), <b>which</b> (şey), <b>that</b> (ikisi de, virgülsüz), <b>whose</b> (sahiplik), <b>where</b> (yer), <b>when</b> (zaman).',
        'Virgülsüz (defining): bilgi zorunlu. <i>People who live in cities...</i>',
        'Virgüllü (non-defining): ek bilgi. Burada <b>that kullanılmaz</b>: <i>Istanbul, which is the largest city, ...</i>',
        'Zamir tekrarı yapma: <span class="wrong">The company that I work for it is...</span>',
        'Kısaltma: <i>Students <b>living</b> in cities</i> = students who live in cities.'
      ],
      examples: [
        'Children who exercise regularly tend to perform better at school.',
        'The report, which was published in 2022, highlights several risks.',
        'Pilots whose licences have expired cannot fly.'
      ],
      exercises: [
        { type: 'mcq', q: 'People ___ live in rural areas often have limited access to healthcare.', options: ['which', 'who', 'whose'], answer: 1, why: 'İnsan → who.' },
        { type: 'mcq', q: 'Istanbul, ___ is the largest city in Turkey, attracts millions of tourists.', options: ['that', 'which', 'where'], answer: 1, why: 'Virgüllü ek bilgi + şey → which. Virgülden sonra "that" olmaz.' },
        { type: 'gap', q: 'Pilots ___ licences have expired cannot fly.', answers: ['whose'], why: 'Sahiplik (pilotların lisansları) → whose.' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['The company that I work for it is based in Ankara.', 'The company that I work for is based in Ankara.', 'The company where I work for is based in Ankara.'], answer: 1, why: '"it" tekrarı Türkçe etkisiyle yapılan bir hatadır. "where ... for" da çift kullanım olur.' },
        { type: 'build', tr: 'Düzenli egzersiz yapan çocuklar okulda daha başarılı olma eğilimindedir.', words: ['Children', 'who', 'exercise', 'regularly', 'tend', 'to', 'perform', 'better', 'at', 'school'], answer: 'Children who exercise regularly tend to perform better at school', why: '"yapan çocuklar" → children who ... ; "eğilimindedir" → tend to.' },
        { type: 'gap', q: 'This is the region ___ the factory was built.', answers: ['where', 'in which'], why: 'Yer → where (= in which).' },
        { type: 'mcq', q: 'The report, ___ was published in 2022, highlights several risks.', options: ['which', 'that', 'who'], answer: 0, why: 'Virgüllü + şey → which.' },
        { type: 'write', prompt: 'İki cümleyi tek cümlede birleştir: "Many young people move to big cities. They want better job opportunities."', models: ['Many young people who want better job opportunities move to big cities.', 'Many young people move to big cities, where there are better job opportunities.'], focus: 'who ile özneyi tanımla ya da where ile yeri anlat.' }
      ]
    },
    {
      id: 'conditionals',
      title: 'Conditionals & Temkinli Dil (Task 2)',
      emoji: '🤔',
      ielts: 'Task 2\'de argüman geliştirmenin en güçlü aracıdır. Temkinli dil (may, tend to, is likely to) akademik tonu yükseltir.',
      explain: [
        '1st: <b>If + present, will/can</b>. Gerçekçi sonuç: <i>If governments invest in public transport, traffic <b>will</b> decrease.</i>',
        '2nd: <b>If + past, would</b>. Varsayım: <i>If cars <b>were</b> banned in city centres, air quality <b>would</b> improve.</i>',
        '<span class="wrong">If I would have</span> → <span class="right">If I had</span>. "if" tarafında would olmaz.',
        '<b>unless</b> = if not. Ayrıca <i>provided that, as long as</i>.',
        'Temkinli dil: <i>may / might / could, tend to, is likely to</i>. Kesin genellemelerden kaçın.'
      ],
      examples: [
        'If more people used bicycles, cities would be less polluted.',
        'Unless action is taken soon, many species will become extinct.',
        'Social media can have a negative impact on young people.'
      ],
      exercises: [
        { type: 'mcq', q: 'If more people ___ bicycles, cities would be less polluted.', options: ['use', 'used', 'will use'], answer: 1, why: '2nd conditional: If + past, would.' },
        { type: 'mcq', q: 'If the government raises taxes on fuel, people ___ less.', options: ['would drive', 'will drive', 'drove'], answer: 1, why: '1st conditional: If + present, will.' },
        { type: 'gap', q: '___ action is taken soon, many species will become extinct.', answers: ['unless'], why: 'unless = if not (eğer ... alınmazsa).' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['If I would have more time, I would study more.', 'If I had more time, I would study more.', 'If I have more time, I would study more.'], answer: 1, why: 'If tarafında past (had), diğer tarafta would.' },
        { type: 'build', tr: 'Ebeveynler daha katı olsaydı, çocuklar ekranlarda daha az zaman geçirirdi.', words: ['If', 'parents', 'were', 'stricter,', 'children', 'would', 'spend', 'less', 'time', 'on', 'screens'], answer: 'If parents were stricter, children would spend less time on screens', why: '2nd conditional + "less time" (time sayılamaz).' },
        { type: 'mcq', q: 'En akademik ifade hangisi?', options: ['Social media destroys young people.', 'Social media can have a negative impact on young people.', 'Social media is very very bad for young people.'], answer: 1, why: 'Temkinli (can) + akademik kalıp (have a negative impact on).' },
        { type: 'gap', q: 'Online learning is ___ to become more common in the future. (olası)', answers: ['likely'], why: 'be likely to + V1 = muhtemelen ... olacak.' },
        { type: 'write', prompt: 'Task 2 argümanı: "Şehir merkezlerinde özel araçlar yasaklansa..." fikrini 2nd conditional ile tek cümlede yaz.', models: ['If private cars were banned from city centres, air pollution would fall significantly and public spaces would become safer for pedestrians.'], focus: 'If + were banned (passive past), would + V1. Sonucu somutlaştır.' }
      ]
    },
    {
      id: 'linking',
      title: 'Bağlaçlar & Cohesion',
      emoji: '🧩',
      ielts: 'Coherence & Cohesion kriterinin temelidir. Dikkat: bağlacı her cümleye koymak "mechanical" sayılır ve Band 6\'da tutar. Az ama doğru kullan.',
      explain: [
        'Zıtlık: <b>although / even though</b> + cümle. <b>despite / in spite of</b> + isim veya V-ing. <b>However,</b> yeni cümle başında.',
        '<b>whereas / while</b>: iki şeyi karşılaştırır. <i>X rose, whereas Y fell.</i>',
        'Sebep: <b>because</b> + cümle. <b>because of / due to</b> + isim. Sonuç: <i>therefore, as a result, consequently</i>.',
        '<span class="wrong">Despite it was raining</span> → <span class="right">Although it was raining / Despite the rain</span>',
        '<span class="wrong">Although ..., but ...</span>. Türkçe\'deki "-e rağmen ... ama" çiftini İngilizce\'de kullanma.'
      ],
      examples: [
        'Despite the high cost, many people still prefer to fly.',
        'Air travel is fast. However, it produces large amounts of CO2.',
        'While some people prefer working from home, others enjoy being in the office.'
      ],
      exercises: [
        { type: 'mcq', q: '___ the high cost, many people still prefer to fly.', options: ['Although', 'Despite', 'However'], answer: 1, why: 'Arkasından isim (the high cost) geliyor → Despite.' },
        { type: 'mcq', q: 'Air travel is fast. ___, it produces large amounts of CO2.', options: ['Although', 'However', 'Despite'], answer: 1, why: 'Yeni cümle başında, virgülle → However.' },
        { type: 'gap', q: 'Many flights were cancelled ___ the storm. (yüzünden, 2 kelime)', answers: ['due to', 'because of'], why: 'İsim (the storm) → due to / because of.' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['Despite he studied hard, he failed.', 'Although he studied hard, he failed.', 'Although he studied hard, but he failed.'], answer: 1, why: 'Cümle → although. "but" eklenmez.' },
        { type: 'build', tr: 'Bazı insanlar evden çalışmayı tercih ederken, diğerleri ofiste olmaktan hoşlanır.', words: ['While', 'some', 'people', 'prefer', 'working', 'from', 'home,', 'others', 'enjoy', 'being', 'in', 'the', 'office'], answer: 'While some people prefer working from home, others enjoy being in the office', why: 'while = -iken (karşılaştırma). enjoy + V-ing.' },
        { type: 'mcq', q: 'The policy reduced traffic. ___, air quality in the city improved.', options: ['As a result', 'Despite', 'Whereas'], answer: 0, why: 'Sebep → sonuç ilişkisi.' },
        { type: 'gap', q: 'In spite ___ the economic crisis, the company expanded.', answers: ['of'], why: 'Kalıp: in spite OF + isim.' },
        { type: 'write', prompt: 'İki cümleyi üç farklı bağlaçla birleştir: "Renewable energy is expensive to install. It saves money in the long term."', models: ['Although renewable energy is expensive to install, it saves money in the long term.', 'Renewable energy is expensive to install; however, it saves money in the long term.', 'Despite being expensive to install, renewable energy saves money in the long term.'], focus: 'although + cümle / ; however, / despite + V-ing.' }
      ]
    },
    {
      id: 'agreement',
      title: 'Sayılamayanlar & Özne-Fiil Uyumu',
      emoji: '⚖️',
      ielts: 'informations, researches, advices gibi hatalar her yazıda tekrarlanır ve "frequent errors" sayılır. Kolay puan kaybıdır.',
      explain: [
        'İngilizce\'de sayılamayan: <b>information, advice, research, equipment, evidence, knowledge, traffic, pollution, transport, accommodation</b>. -s almaz, a/an almaz, fiil tekil olur.',
        '<b>many / fewer</b> sayılabilirlerle, <b>much / less / an amount of</b> sayılamayanlarla kullanılır.',
        '<i>The number of cars <b>is</b> rising</i> (özne: number, tekil). <i>A number of problems <b>are</b>...</i> (birçok, çoğul).',
        '<i>One of the main reasons <b>is</b>...</i> (özne: one).',
        '<b>every / each</b> + tekil isim + tekil fiil.'
      ],
      examples: [
        'Recent research shows that sleep affects memory.',
        'The number of international students has increased dramatically.',
        'There are fewer cars on the roads at weekends.'
      ],
      exercises: [
        { type: 'mcq', q: 'The internet provides a lot of useful ___.', options: ['informations', 'information', 'an information'], answer: 1, why: 'information sayılamaz.' },
        { type: 'mcq', q: 'The number of international students ___ increased dramatically.', options: ['have', 'has', 'are'], answer: 1, why: 'Özne "the number" → tekil.' },
        { type: 'gap', q: 'One of the main reasons ___ the lack of public funding. (be)', answers: ['is'], why: 'Özne "one" → tekil.' },
        { type: 'mcq', q: 'There are ___ cars on the roads at weekends.', options: ['less', 'fewer', 'much'], answer: 1, why: 'cars sayılabilir → fewer.' },
        { type: 'mcq', q: 'Doğru cümleyi seç:', options: ['Recent researches show that sleep affects memory.', 'Recent research shows that sleep affects memory.', 'A recent research show that sleep affects memory.'], answer: 1, why: 'research sayılamaz, fiil tekil (shows).' },
        { type: 'build', tr: 'Her öğrencinin modern ekipmana erişimi olmalı.', words: ['Every', 'student', 'should', 'have', 'access', 'to', 'modern', 'equipment'], answer: 'Every student should have access to modern equipment', why: 'every + tekil; equipment sayılamaz; have access TO.' },
        { type: 'gap', q: 'A large ___ of money is spent on advertising. (miktar)', answers: ['amount'], why: 'money sayılamaz → an amount of.' },
        { type: 'write', prompt: 'Hatalı cümleyi düzelt: "Many evidences suggests that the traffic in big cities are getting worse."', models: ['Much evidence suggests that traffic in big cities is getting worse.', 'There is a lot of evidence that traffic in big cities is getting worse.'], focus: 'evidence ve traffic sayılamaz → much / tekil fiil. Genel anlamda traffic artikelsiz.' }
      ]
    }
  ],

  reading: [
    {
      id: 'saf',
      title: 'The Promise of Sustainable Aviation Fuel',
      minutes: 20,
      paragraphs: [
        ['A', 'Aviation is often described as one of the hardest sectors of the economy to decarbonise. Although it accounts for only around two to three percent of global carbon dioxide emissions, demand for air travel is expected to keep growing, and long-haul aircraft cannot easily run on batteries. As a result, attention has turned to a different solution: changing the fuel rather than the aircraft.'],
        ['B', 'Sustainable aviation fuel, or SAF, can be produced from a wide range of materials, including waste cooking oil, agricultural residues and even household rubbish. Crucially, it is a "drop-in" fuel, which means it can be blended with conventional jet fuel and used in existing engines without modification. Current standards allow a blend of up to 50 percent.'],
        ['C', 'The main obstacle is price. Depending on the production method, SAF can cost between two and five times as much as fossil jet fuel. Supply is also extremely limited: at present, it makes up less than one percent of the fuel used by airlines worldwide. Producers argue that costs will only fall once large-scale refineries are built, but investors are reluctant to fund such projects without guaranteed demand.'],
        ['D', 'Governments have begun to intervene. In the European Union, fuel suppliers at airports are now required to include a minimum share of SAF, starting at two percent in 2025 and rising to six percent by 2030. The long-term target is far more ambitious, with the share expected to reach 70 percent by the middle of the century.'],
        ['E', 'Not everyone is convinced. Critics point out that the supply of waste oils is finite and that growing crops for fuel could compete with food production. Some experts therefore suggest that SAF should be combined with other measures, such as hydrogen or electric aircraft for short routes and policies that reduce unnecessary flying.']
      ],
      questions: [
        { kind: 'tfng', items: [
          { s: 'SAF can only be used in specially designed aircraft engines.', a: 'F', why: 'B: "used in existing engines without modification".' },
          { s: 'Waste cooking oil is one of the materials used to make SAF.', a: 'T', why: 'B: "including waste cooking oil".' },
          { s: 'The first commercial flight using SAF took place in Europe.', a: 'NG', why: 'Metinde ilk uçuştan hiç bahsedilmiyor.' },
          { s: 'SAF is currently cheaper than conventional jet fuel.', a: 'F', why: 'C: "two and five times as much as fossil jet fuel".' },
          { s: 'The EU requires the share of SAF to increase over time.', a: 'T', why: 'D: "starting at two percent ... rising to six percent".' }
        ] },
        { kind: 'headings', options: ['i. A costly and scarce product', 'ii. Where the fuel comes from', 'iii. Doubts about the solution', 'iv. The history of the jet engine', 'v. Official targets'], items: [
          { p: 'B', a: 1 }, { p: 'C', a: 0 }, { p: 'D', a: 4 }, { p: 'E', a: 2 }
        ] },
        { kind: 'gap', note: 'NO MORE THAN ONE WORD AND/OR A NUMBER', items: [
          { s: 'SAF can be mixed with conventional fuel at up to ___ percent.', a: ['50', 'fifty'] },
          { s: 'Some experts suggest using ___ or electric aircraft for short routes.', a: ['hydrogen'] },
          { s: 'Investors want guaranteed ___ before funding new refineries.', a: ['demand'] }
        ] }
      ]
    },
    {
      id: 'sleep',
      title: 'Sleep and the Learning Brain',
      minutes: 20,
      paragraphs: [
        ['A', 'For much of the twentieth century, sleep was regarded as a largely passive state, a period in which the brain simply rested. Over the past few decades, however, researchers have gathered convincing evidence that sleep plays an active role in learning, particularly in the process of turning short-term experiences into lasting memories.'],
        ['B', 'Some of the clearest evidence comes from laboratory experiments. In a typical study, participants learn a list of word pairs in the evening. Half of them then sleep normally, while the other half are kept awake. When both groups are tested the next day, those who slept consistently recall more pairs, even when the effects of tiredness are taken into account.'],
        ['C', 'Not all sleep appears to serve the same function. Deep, slow-wave sleep seems to be especially important for remembering facts and events, whereas the stage known as REM sleep, during which most vivid dreaming occurs, has been linked to learning physical skills and processing emotional experiences.'],
        ['D', 'Brain recordings have helped to explain why. During sleep, the hippocampus, a region essential for forming new memories, appears to "replay" patterns of activity from the day. This replay is thought to help transfer information to the outer layer of the brain, the cortex, where it can be stored for the long term.'],
        ['E', 'These findings have practical implications. Students who stay up all night before an exam, a practice known as cramming, may be undermining the very process that would help them remember. Short naps can also improve learning, although researchers stress that individual needs differ and that no single sleep schedule suits everyone.']
      ],
      questions: [
        { kind: 'tfng', items: [
          { s: 'Scientists have always believed that sleep plays an active role in memory.', a: 'F', why: 'A: Uzun süre "largely passive state" olarak görülmüş.' },
          { s: 'In the experiments, participants who slept remembered more word pairs.', a: 'T', why: 'B: "those who slept consistently recall more pairs".' },
          { s: 'REM sleep is the longest stage of sleep.', a: 'NG', why: 'Sürelerden bahsedilmiyor.' },
          { s: 'The hippocampus is involved in replaying memories during sleep.', a: 'T', why: 'D: "the hippocampus ... appears to replay".' },
          { s: 'The writer recommends that every student should take a 90-minute nap daily.', a: 'F', why: 'E: "no single sleep schedule suits everyone".' }
        ] },
        { kind: 'headings', options: ['i. A change in scientific thinking', 'ii. Different stages, different jobs', 'iii. Advice for learners', 'iv. What dreams really mean', 'v. Evidence from the laboratory', 'vi. Moving memories into long-term storage'], items: [
          { p: 'A', a: 0 }, { p: 'B', a: 4 }, { p: 'C', a: 1 }, { p: 'D', a: 5 }, { p: 'E', a: 2 }
        ] },
        { kind: 'gap', note: 'NO MORE THAN ONE WORD', items: [
          { s: 'Slow-wave sleep is important for remembering facts and ___.', a: ['events'] },
          { s: 'Information is moved to the ___ for long-term storage.', a: ['cortex'] },
          { s: 'Staying awake all night to study is called ___.', a: ['cramming'] }
        ] }
      ]
    },
    {
      id: 'cities',
      title: 'Cooling the Urban Heat Island',
      minutes: 20,
      paragraphs: [
        ['A', 'On a summer afternoon, the centre of a large city can be several degrees warmer than the surrounding countryside. This phenomenon, known as the urban heat island effect, occurs because materials such as asphalt and concrete absorb heat during the day and release it slowly at night. Waste heat from vehicles and air-conditioning units adds to the problem.'],
        ['B', 'The consequences are more than a matter of comfort. Higher temperatures increase the demand for electricity, which in turn can raise emissions if power is generated from fossil fuels. More seriously, heatwaves in dense urban areas are associated with a rise in hospital admissions, particularly among elderly residents and people with existing health conditions.'],
        ['C', 'One of the simplest responses is to change the colour of surfaces. Light-coloured or "cool" roofs reflect a larger proportion of sunlight than dark ones, and several cities now offer financial incentives to building owners who install them. Some have also experimented with reflective coatings on roads, although their long-term durability is still being tested.'],
        ['D', 'Vegetation offers a second solution. Trees provide shade and release moisture into the air, which lowers the surrounding temperature. Parks, green roofs and even narrow strips of planting along streets can make a measurable difference. However, planners note that trees take years to mature and require water, which may be scarce in hot, dry regions.'],
        ['E', 'Ultimately, experts argue that no single measure is sufficient. The most effective strategies combine reflective materials, green spaces and building designs that encourage natural ventilation. Crucially, these changes need to be planned at the level of the whole city rather than left to individual property owners.']
      ],
      questions: [
        { kind: 'tfng', items: [
          { s: 'City centres can be warmer than nearby rural areas.', a: 'T', why: 'A: "several degrees warmer than the surrounding countryside".' },
          { s: 'Air-conditioning units help to reduce the urban heat island effect.', a: 'F', why: 'A: Waste heat "adds to the problem".' },
          { s: 'Elderly people are more affected by urban heatwaves.', a: 'T', why: 'B: "particularly among elderly residents".' },
          { s: 'Reflective road coatings have been proven to last for decades.', a: 'F', why: 'C: "durability is still being tested". Kanıtlanmamış.' },
          { s: 'Green roofs are cheaper to build than cool roofs.', a: 'NG', why: 'Maliyet karşılaştırması yapılmıyor.' }
        ] },
        { kind: 'headings', options: ['i. Planting for lower temperatures', 'ii. Why cities heat up', 'iii. A combined, city-wide approach', 'iv. Effects on health and energy', 'v. The history of urban planning', 'vi. Changing the colour of surfaces'], items: [
          { p: 'A', a: 1 }, { p: 'B', a: 3 }, { p: 'C', a: 5 }, { p: 'D', a: 0 }, { p: 'E', a: 2 }
        ] },
        { kind: 'gap', note: 'NO MORE THAN TWO WORDS', items: [
          { s: 'Asphalt and concrete release stored heat slowly ___.', a: ['at night'] },
          { s: 'Some cities give financial ___ to owners who install cool roofs.', a: ['incentives'] },
          { s: 'A disadvantage of trees in dry regions is that they need ___.', a: ['water'] }
        ] }
      ]
    }
  ],

  listening: [
    {
      id: 'club',
      title: 'Part 1: Uçuş kulübü üyeliği',
      part: 1,
      note: 'Bir form doldur. NO MORE THAN ONE WORD AND/OR A NUMBER.',
      lines: [
        ['R', 'Good morning, Skyline Flying Club. How can I help you?'],
        ['C', 'Hi. I\'m calling about membership. I\'d like to start flying lessons.'],
        ['R', 'Of course. Can I take your name first?'],
        ['C', 'Yes, it\'s Daniel Hartley.'],
        ['R', 'Could you spell your surname, please?'],
        ['C', 'Sure. H. A. R. T. L. E. Y.'],
        ['R', 'Thank you. And a contact number?'],
        ['C', 'It\'s oh, seven, nine, four, six... three, eight, two... one, one, five.'],
        ['R', 'Lovely. Now, we have three types of membership: full, weekend and student. Are you studying at the moment?'],
        ['C', 'Yes, I\'m doing an engineering degree at the university.'],
        ['R', 'Then the student membership is the best option for you. It\'s normally sixty pounds a month, but students pay forty-five.'],
        ['C', 'Forty-five pounds. That\'s reasonable.'],
        ['R', 'Your first lesson could be on the fourteenth of May, if that suits you.'],
        ['C', 'The fourteenth is perfect.'],
        ['R', 'Great. Please bring some form of ID and one passport photograph for your membership card.'],
        ['C', 'No problem. Thanks for your help.']
      ],
      questions: [
        { s: 'Surname: ___', a: ['hartley'] },
        { s: 'Phone number: ___', a: ['07946382115'], digits: true },
        { s: 'Type of membership: ___', a: ['student'] },
        { s: 'Monthly fee: £___', a: ['45', 'forty-five', 'forty five'] },
        { s: 'Date of first lesson: ___', a: ['14 may', '14th may', 'may 14', 'may 14th', '14/05', '14.05'] },
        { s: 'Bring: ID and a passport ___', a: ['photograph', 'photo'] }
      ]
    },
    {
      id: 'museum',
      title: 'Part 2: Havacılık müzesi turu',
      part: 2,
      note: 'Cümleleri tamamla. NO MORE THAN TWO WORDS AND/OR A NUMBER.',
      lines: [
        ['G', 'Good morning, everyone, and welcome to the Northfield Aviation Museum. My name is Claire, and I\'ll be your guide today.'],
        ['G', 'Before we start, let me give you a little background. The museum first opened its doors in nineteen eighty-seven, although the collection itself is much older.'],
        ['G', 'Today\'s tour will last about ninety minutes, so there will be plenty of time to see everything.'],
        ['G', 'Just a few rules. Photography is allowed everywhere, but please don\'t bring any food into the main hangar, as it attracts birds. Drinks are fine, as long as they have a lid.'],
        ['G', 'Now, many of you have asked about the flight simulator. It\'s located on the second floor, next to the gift shop, and you\'ll need to book a time slot at the information desk.'],
        ['G', 'Finally, our café is on the ground floor. It normally closes at five, but today it closes at half past four because of a private event.'],
        ['G', 'Right, let\'s begin with the oldest aircraft in our collection.']
      ],
      questions: [
        { s: 'The museum opened in ___.', a: ['1987'] },
        { s: 'The tour lasts about ___ minutes.', a: ['90', 'ninety'] },
        { s: 'Visitors must not take ___ into the main hangar.', a: ['food', 'any food'] },
        { s: 'The flight simulator is on the ___ floor.', a: ['second', '2nd'] },
        { s: 'Simulator slots are booked at the ___ desk.', a: ['information'] },
        { s: 'Today the café closes at ___.', a: ['4.30', '4:30', 'half past four', '16:30', '16.30', '430'] }
      ]
    }
  ],

  writing: [
    {
      id: 't1-airports', task: 1, kind: 'line',
      title: 'Line graph: Havalimanı yolcu sayıları',
      prompt: 'The graph below shows the number of passengers (in millions) using three airports in a country between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      chart: { type: 'line', unit: 'million', labels: ['2000', '2005', '2010', '2015', '2020'], series: [
        { name: 'Airport A', data: [12, 15, 20, 26, 30] },
        { name: 'Airport B', data: [8, 9, 9, 10, 11] },
        { name: 'Airport C', data: [2, 5, 9, 14, 22] }
      ] }
    },
    {
      id: 't1-commute', task: 1, kind: 'bar',
      title: 'Bar chart: İşe gidiş ulaşım tercihleri',
      prompt: 'The chart below shows the percentage of people using different modes of transport to travel to work in a city in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
      chart: { type: 'bar', unit: '%', labels: ['Car', 'Bus', 'Train', 'Bicycle', 'Walking'], series: [
        { name: '1990', data: [55, 25, 10, 5, 5] },
        { name: '2020', data: [40, 20, 22, 12, 6] }
      ] }
    },
    {
      id: 't1-glass', task: 1, kind: 'process',
      title: 'Process: Cam şişe geri dönüşümü',
      prompt: 'The diagram below shows how glass bottles are recycled. Summarise the information by selecting and reporting the main features. Write at least 150 words.',
      chart: { type: 'process', steps: ['Used bottles collected from recycling bins', 'Taken by lorry to a recycling plant', 'Sorted by colour (clear, green, brown)', 'Washed to remove labels and dirt', 'Crushed into small pieces ("cullet")', 'Melted in a furnace at 1,500°C', 'Moulded into new bottles', 'Filled and delivered to shops'] }
    },
    { id: 't2-university', task: 2, kind: 'discuss', title: 'Discuss both views: Ücretsiz üniversite', prompt: 'Some people believe that university education should be free for all students, while others think students should pay for their own studies. Discuss both views and give your own opinion. Write at least 250 words.' },
    { id: 't2-airtravel', task: 2, kind: 'advdis', title: 'Advantages vs disadvantages: Ucuz hava yolculuğu', prompt: 'In many countries, air travel is becoming cheaper and more popular. Do the advantages of this development outweigh the disadvantages? Write at least 250 words.' },
    { id: 't2-transport', task: 2, kind: 'opinion', title: 'Opinion: Toplu taşıma vs yeni yollar', prompt: 'Some people think that governments should spend more money on public transport than on building new roads. To what extent do you agree or disagree? Write at least 250 words.' },
    { id: 't2-social', task: 2, kind: 'problem', title: 'Problem & solution: Gençler ve sosyal medya', prompt: 'Many young people today spend a large amount of time on social media. What problems does this cause, and what solutions can you suggest? Write at least 250 words.' },
    { id: 't2-tech', task: 2, kind: 'opinion', title: 'Opinion: Teknoloji ve işler', prompt: 'Technology is replacing many jobs that humans used to do. Is this a positive or negative development? Write at least 250 words.' }
  ],

  writingGuides: {
    1: {
      plan: [
        '<b>Giriş (1 cümle):</b> Soruyu kendi kelimelerinle yeniden yaz (paraphrase). "The graph shows" → "The line graph illustrates..."',
        '<b>Overview (2 cümle):</b> En önemli 2 genel eğilim. Sayı yok! "Overall, it is clear that..." <i>Overview yoksa Band 5–6\'da kalırsın.</i>',
        '<b>Body 1:</b> İlk grup veri: en büyük/önemli değişimler, sayılarla.',
        '<b>Body 2:</b> İkinci grup ve karşılaştırmalar (whereas, compared with, twice as...).'
      ],
      phrases: ['The line graph illustrates / compares...', 'Overall, it is clear that...', 'X rose steadily from ... to ...', 'X peaked at ... in ...', 'There was a sharp increase in ...', 'By contrast, the figure for Y ...', '... whereas Y remained relatively stable.', 'X accounted for the largest proportion of ...', 'In the first stage of the process, ...', 'Once ... has been ..., it is ...', 'Finally, ...']
    },
    2: {
      plan: [
        '<b>Giriş (2–3 cümle):</b> Konuyu paraphrase et + net pozisyon (thesis). "This essay will argue that..."',
        '<b>Body 1:</b> Ana fikir cümlesi → açıklama → somut örnek → bağlantı.',
        '<b>Body 2:</b> İkinci fikir (ya da karşı görüş) aynı yapıyla.',
        '<b>Sonuç (2 cümle):</b> Pozisyonu tekrar et, yeni fikir ekleme. "In conclusion, ..."'
      ],
      phrases: ['It is often argued that...', 'There are several reasons why...', 'The main reason for this is that...', 'For example, / For instance, ...', 'This means that... / As a result, ...', 'On the other hand, opponents claim that...', 'While it is true that ..., I believe that...', 'A further problem is that...', 'One possible solution would be to...', 'In conclusion, although ..., I firmly believe that...']
    }
  },

  vocab: [
    { w: 'significant', tr: 'önemli, kayda değer', col: 'a significant increase in', ex: 'There was a significant increase in sales after 2015.' },
    { w: 'approximately', tr: 'yaklaşık', col: 'approximately 40 percent', ex: 'Approximately 40 percent of commuters travelled by car.' },
    { w: 'proportion', tr: 'oran', col: 'a large proportion of', ex: 'A large proportion of students work part-time.' },
    { w: 'decline', tr: 'düşüş; azalmak', col: 'a steady decline in', ex: 'There was a steady decline in the birth rate.' },
    { w: 'fluctuate', tr: 'dalgalanmak', col: 'fluctuate between X and Y', ex: 'Prices fluctuated between $20 and $30.' },
    { w: 'remain stable', tr: 'sabit kalmak', col: 'remain relatively stable', ex: 'The figure remained relatively stable until 2010.' },
    { w: 'peak', tr: 'zirve(ye ulaşmak)', col: 'peak at', ex: 'Unemployment peaked at 12% in 2009.' },
    { w: 'substantial', tr: 'büyük, hatırı sayılır', col: 'a substantial amount of', ex: 'A substantial amount of money was invested.' },
    { w: 'considerably', tr: 'önemli ölçüde', col: 'considerably higher than', ex: 'Costs were considerably higher than expected.' },
    { w: 'trend', tr: 'eğilim', col: 'an upward trend', ex: 'The data shows an upward trend in online sales.' },
    { w: 'illustrate', tr: 'göstermek, açıklamak', col: 'the chart illustrates', ex: 'The chart illustrates changes in energy use.' },
    { w: 'account for', tr: '(bir oranı) oluşturmak', col: 'account for 40% of', ex: 'Cars accounted for 40% of all journeys.' },
    { w: 'respectively', tr: 'sırasıyla', col: '20% and 30% respectively', ex: 'The figures for A and B were 20% and 30% respectively.' },
    { w: 'overall', tr: 'genel olarak', col: 'Overall, it is clear that', ex: 'Overall, it is clear that rail travel became more popular.' },
    { w: 'whereas', tr: 'oysa, -iken', col: 'X rose, whereas Y fell', ex: 'Exports rose, whereas imports fell.' },
    { w: 'contribute to', tr: '-e katkıda bulunmak, yol açmak', col: 'contribute to pollution', ex: 'Heavy traffic contributes to air pollution.' },
    { w: 'consequence', tr: '(çoğunlukla olumsuz) sonuç', col: 'serious consequences', ex: 'Climate change has serious consequences for farming.' },
    { w: 'impact', tr: 'etki', col: 'have a negative impact on', ex: 'Screens can have a negative impact on sleep.' },
    { w: 'drawback', tr: 'dezavantaj', col: 'a major drawback', ex: 'The major drawback is the high cost.' },
    { w: 'outweigh', tr: 'ağır basmak', col: 'the benefits outweigh the drawbacks', ex: 'I believe the benefits outweigh the drawbacks.' },
    { w: 'tackle', tr: 'ele almak, mücadele etmek', col: 'tackle the problem of', ex: 'Governments must tackle the problem of youth unemployment.' },
    { w: 'address', tr: '(sorunu) ele almak', col: 'address the issue', ex: 'The policy fails to address the issue of housing.' },
    { w: 'implement', tr: 'uygulamak', col: 'implement a policy', ex: 'The city implemented a congestion charge.' },
    { w: 'regulation', tr: 'düzenleme, kural', col: 'strict regulations', ex: 'Strict regulations on emissions were introduced.' },
    { w: 'sustainable', tr: 'sürdürülebilir', col: 'sustainable development', ex: 'Sustainable development balances growth and the environment.' },
    { w: 'emission', tr: 'salım, emisyon', col: 'carbon emissions', ex: 'Aviation produces large carbon emissions.' },
    { w: 'infrastructure', tr: 'altyapı', col: 'invest in infrastructure', ex: 'The country needs to invest in infrastructure.' },
    { w: 'urbanisation', tr: 'kentleşme', col: 'rapid urbanisation', ex: 'Rapid urbanisation has increased housing prices.' },
    { w: 'affordable', tr: 'uygun fiyatlı', col: 'affordable housing', ex: 'Young people struggle to find affordable housing.' },
    { w: 'access', tr: 'erişim', col: 'have access to', ex: 'Everyone should have access to clean water.' },
    { w: 'inevitable', tr: 'kaçınılmaz', col: 'an inevitable consequence', ex: 'Job losses are an inevitable consequence of automation.' },
    { w: 'widespread', tr: 'yaygın', col: 'the widespread use of', ex: 'The widespread use of smartphones has changed communication.' },
    { w: 'crucial', tr: 'çok önemli, kritik', col: 'play a crucial role in', ex: 'Teachers play a crucial role in child development.' },
    { w: 'enhance', tr: 'geliştirmek, artırmak', col: 'enhance the quality of', ex: 'Technology can enhance the quality of education.' },
    { w: 'alleviate', tr: 'hafifletmek', col: 'alleviate traffic congestion', ex: 'New metro lines could alleviate traffic congestion.' },
    { w: 'congestion', tr: '(trafik) tıkanıklığı', col: 'traffic congestion', ex: 'Traffic congestion costs cities billions each year.' },
    { w: 'perspective', tr: 'bakış açısı', col: 'from an economic perspective', ex: 'From an economic perspective, the plan makes sense.' },
    { w: 'controversial', tr: 'tartışmalı', col: 'a controversial issue', ex: 'Animal testing remains a controversial issue.' },
    { w: 'advocate', tr: 'savunmak; savunucu', col: 'advocate stricter laws', ex: 'Many experts advocate stricter laws on advertising.' },
    { w: 'opponent', tr: 'karşı çıkan, muhalif', col: 'opponents of the policy', ex: 'Opponents of the policy argue that it is too expensive.' },
    { w: 'justify', tr: 'haklı çıkarmak', col: 'justify the cost', ex: 'It is difficult to justify the cost of space exploration.' },
    { w: 'allocate', tr: 'tahsis etmek, ayırmak', col: 'allocate funds to', ex: 'The government should allocate more funds to healthcare.' },
    { w: 'priority', tr: 'öncelik', col: 'a top priority', ex: 'Road safety should be a top priority.' },
    { w: 'mandatory', tr: 'zorunlu', col: 'mandatory for all', ex: 'Physical education should be mandatory for all students.' },
    { w: 'detrimental', tr: 'zararlı', col: 'detrimental to health', ex: 'Lack of sleep is detrimental to health.' },
    { w: 'beneficial', tr: 'faydalı', col: 'beneficial for / to', ex: 'Regular exercise is beneficial for mental health.' },
    { w: 'acquire', tr: 'edinmek', col: 'acquire new skills', ex: 'Workers need to acquire new skills throughout their careers.' },
    { w: 'workforce', tr: 'işgücü', col: 'a skilled workforce', ex: 'A skilled workforce attracts foreign investment.' },
    { w: 'automation', tr: 'otomasyon', col: 'the rise of automation', ex: 'The rise of automation threatens many factory jobs.' },
    { w: 'obsolete', tr: 'eskimiş, kullanılmaz hale gelmiş', col: 'become obsolete', ex: 'Some professions may become obsolete.' },
    { w: 'isolation', tr: 'yalnızlık, yalıtılmışlık', col: 'social isolation', ex: 'Excessive screen time can lead to social isolation.' },
    { w: 'exacerbate', tr: 'kötüleştirmek', col: 'exacerbate the problem', ex: 'Building more roads may exacerbate the problem.' },
    { w: 'facilitate', tr: 'kolaylaştırmak', col: 'facilitate communication', ex: 'The internet facilitates communication across borders.' },
    { w: 'phenomenon', tr: 'olgu, fenomen', col: 'a global phenomenon', ex: 'Urbanisation is a global phenomenon.' },
    { w: 'nevertheless', tr: 'yine de', col: 'Nevertheless, ...', ex: 'The plan is expensive. Nevertheless, it is necessary.' },
    { w: 'consequently', tr: 'sonuç olarak', col: 'Consequently, ...', ex: 'Fuel prices rose. Consequently, fewer people drove.' },
    { w: 'compared with', tr: '-e kıyasla', col: 'compared with the previous year', ex: 'Sales fell by 5% compared with the previous year.' },
    { w: 'decarbonise', tr: 'karbondan arındırmak', col: 'decarbonise the economy', ex: 'Aviation is difficult to decarbonise.' },
    { w: 'incentive', tr: 'teşvik', col: 'financial incentives', ex: 'Financial incentives encourage people to buy electric cars.' },
    { w: 'reluctant', tr: 'isteksiz', col: 'be reluctant to', ex: 'Investors are reluctant to fund risky projects.' }
  ]
};
