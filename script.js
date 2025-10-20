// 1. VERİ: Lise Müfredatı Element Listesi
const elementler = [
    { atomNo: 1, sembol: 'H', ad: 'Hidrojen' },
    { atomNo: 2, sembol: 'He', ad: 'Helyum' },
    { atomNo: 3, sembol: 'Li', ad: 'Lityum' },
    { atomNo: 4, sembol: 'Be', ad: 'Berilyum' },
    { atomNo: 5, sembol: 'B', ad: 'Bor' },
    { atomNo: 6, sembol: 'C', ad: 'Karbon' },
    { atomNo: 7, sembol: 'N', ad: 'Azot' },
    { atomNo: 8, sembol: 'O', ad: 'Oksijen' },
    { atomNo: 9, sembol: 'F', ad: 'Flor' },
    { atomNo: 10, sembol: 'Ne', ad: 'Neon' },
    { atomNo: 11, sembol: 'Na', ad: 'Sodyum' },
    { atomNo: 12, sembol: 'Mg', ad: 'Magnezyum' },
    { atomNo: 13, sembol: 'Al', ad: 'Alüminyum' },
    { atomNo: 14, sembol: 'Si', ad: 'Silisyum' },
    { atomNo: 15, sembol: 'P', ad: 'Fosfor' },
    { atomNo: 16, sembol: 'S', ad: 'Kükürt' },
    { atomNo: 17, sembol: 'Cl', ad: 'Klor' },
    { atomNo: 18, sembol: 'Ar', ad: 'Argon' },
    { atomNo: 19, sembol: 'K', ad: 'Potasyum' },
    { atomNo: 20, sembol: 'Ca', ad: 'Kalsiyum' },
    { atomNo: 26, sembol: 'Fe', ad: 'Demir' },
    { atomNo: 29, sembol: 'Cu', ad: 'Bakır' },
    { atomNo: 30, sembol: 'Zn', ad: 'Çinko' },
    { atomNo: 47, sembol: 'Ag', ad: 'Gümüş' },
    { atomNo: 79, sembol: 'Au', ad: 'Altın' },
    { atomNo: 80, sembol: 'Hg', ad: 'Cıva' },
    { atomNo: 82, sembol: 'Pb', ad: 'Kurşun' }
];

// 2. HTML Elemanlarını Seçme
const sembolListesi = document.getElementById('sembolListesi');
const isimListesi = document.getElementById('isimListesi');
const yeniOyunButonu = document.getElementById('yeniOyunButonu');
const geriBildirimAlani = document.getElementById('geriBildirimAlani');

// 3. Oyun Değişkenleri
const TUR_BOYUTU = 6;
let mevcutTurElementleri = [];
let seciliSembol = null;
let seciliIsim = null;
let eslesenSayisi = 0;
let tiklamaEngelli = false; 

// 4. Yardımcı Fonksiyon: Diziyi Karıştır
function diziyiKaristir(dizi) {
    let kopyaDizi = [...dizi]; 
    for (let i = kopyaDizi.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopyaDizi[i], kopyaDizi[j]] = [kopyaDizi[j], kopyaDizi[i]];
    }
    return kopyaDizi;
}

// 5. Fonksiyon: Yeni Tur Başlat
function yeniTurBaslat() {
    sembolListesi.innerHTML = '';
    isimListesi.innerHTML = '';
    geriBildirimVer('', false);
    eslesenSayisi = 0;
    seciliSembol = null;
    seciliIsim = null;

    const karisikElementler = diziyiKaristir(elementler);
    mevcutTurElementleri = karisikElementler.slice(0, TUR_BOYUTU);

    const karisikIsimler = diziyiKaristir(mevcutTurElementleri);

    mevcutTurElementleri.forEach(element => {
        kartOlustur(element.sembol, element.sembol, sembolListesi, 'sembol');
    });

    karisikIsimler.forEach(element => {
        kartOlustur(element.ad, element.sembol, isimListesi, 'isim');
    });
}

// 6. Fonksiyon: Tıklanabilir Kartları Oluştur
function kartOlustur(icerik, sembolId, listeElementi, tip) {
    const kart = document.createElement('div');
    kart.className = 'kart';
    kart.textContent = icerik;
    kart.dataset.id = sembolId;
    kart.dataset.tip = tip;
    listeElementi.appendChild(kart);
}

// 7. Olay Dinleyicileri
sembolListesi.addEventListener('click', kartSecildi);
isimListesi.addEventListener('click', kartSecildi);
yeniOyunButonu.addEventListener('click', yeniTurBaslat);

// 8. Fonksiyon: Kart Seçildiğinde
function kartSecildi(e) {
    const tiklananKart = e.target;
    if (!tiklananKart.classList.contains('kart') || tiklananKart.classList.contains('eslesti') || tiklamaEngelli) {
        return;
    }

    document.querySelectorAll('.kart.secili').forEach(kart => {
        if (kart.dataset.tip !== tiklananKart.dataset.tip) return;
        kart.classList.remove('secili');
    });

    tiklananKart.classList.add('secili');

    if (tiklananKart.dataset.tip === 'sembol') {
        seciliSembol = tiklananKart;
    } else {
        seciliIsim = tiklananKart;
    }

    if (seciliSembol && seciliIsim) {
        eslesmeyiKontrolEt();
    }
}

// 9. Fonksiyon: Eşleşmeyi Kontrol Et
function eslesmeyiKontrolEt() {
    tiklamaEngelli = true; 

    const sembolId = seciliSembol.dataset.id;
    const isimId = seciliIsim.dataset.id;

    if (sembolId === isimId) {
        geriBildirimVer('Doğru cevap. Tebrikler!', true); 
        seciliSembol.classList.add('eslesti');
        seciliIsim.classList.add('eslesti');
        seciliSembol.classList.remove('secili');
        seciliIsim.classList.remove('secili');

        eslesenSayisi++;
        tiklamaEngelli = false;
    } else {
        geriBildirimVer('Yanlış cevap. Tekrar deneyin.', false); 
        seciliSembol.classList.add('hatali');
        seciliIsim.classList.add('hatali');

        setTimeout(() => {
            seciliSembol.classList.remove('secili', 'hatali');
            tiklamaEngelli = false;
        }, 1000);
    }

    seciliSembol = null;
    seciliIsim = null;

    if (eslesenSayisi === TUR_BOYUTU) {
        geriBildirimVer('Tebrikler, turu tamamladın!', true);
    }
}

// 10. Fonksiyon: Geri Bildirim Ver
function geriBildirimVer(mesaj, dogruMu) {
    geriBildirimAlani.textContent = mesaj;
    geriBildirimAlani.className = dogruMu ? 'dogru' : 'yanlis';
}

// 11. Başlangıç: Sayfa ilk yüklendiğinde oyunu başlat
yeniTurBaslat();
