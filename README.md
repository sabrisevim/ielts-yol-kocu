# IELTS Yol Koçu (PWA)

Bu uygulama, toplu taşımada telefonla IELTS Academic hazırlığı yapmak için tasarlandı. Kurulum ve derleme gerektirmez. Bağımlılığı yoktur ve bir kez açıldıktan sonra **offline** çalışır.

## Bilgisayarda çalıştırma
```bash
python -m http.server 8765
```
Sonra tarayıcıda http://localhost:8765 adresini aç.

## Telefona kurma
Service worker yalnızca HTTPS üzerinde çalışır, bu yüzden klasörün HTTPS veren bir statik hostinge yüklenmesi gerekir:
- **GitHub Pages:** Klasörü bir repoya koy, sonra Settings → Pages → Deploy from branch.
- **Netlify Drop:** app.netlify.com/drop adresine `ielts-app` klasörünü sürükle.

Telefonda Chrome ile adresi aç, sonra ⋮ menüsünden **Ana ekrana ekle / Uygulamayı yükle** seçeneğine dokun.
Listening için: Ayarlar → Metin okuma çıktısı → Google → English (UK) ses paketini indir. Böylece ses offline da çalışır.

## Dosyalar
| Dosya | İçerik |
|---|---|
| `content.js` | Gramer üniteleri, reading metinleri, listening senaryoları, writing görevleri, kelimeler. Yeni içerik buraya eklenir. |
| `app.js` | Günlük plan, alıştırma motoru, aralıklı tekrar, ilerleme |
| `sw.js` | Offline önbellek. İçerik değişince `CACHE` sürümünü artır. |

İlerleme telefonun tarayıcısında (localStorage) saklanır. İlerleme sayfasından yedek alınabilir.
