export const characters = [
    {
        "id": 1,
        "type": "Villager",
        "image": "/villager.png",
        "name": "Köylü",
        "duties": [],
        "description": "Basit bir köylü, hayatta kalmaya çalışıyor.",
        "description2": "Sabahki oylamada tüm vampirleri bulup asarak oyunu kazanır.",
        "side": "köy",
        "sidecolor": `green`
    },
    {
        "id": 2,
        "type": "Doctor",
        "image": "/doctor.png",
        "name": "Doktor",
        "duties": ["Her gece bir kişiyi koru"],
        "description": "Her gece bir kişiyi vampirlerin saldırılarından koruyabilir.",
        "description2": "Kendini sadece bir kere koruyabilir.",
        "side": "köy",
        "sidecolor": `green`
    },
    {
        "id": 3,
        "type": "Vampire",
        "image": "/vampire.png",
        "name": "Vampir",
        "duties": ["Her gece bir köylüyü öldür"],
        "description": "Geceleyin köylüleri beslenmek için öldürür.",
        "description2": "Eğer oyunda birden fazla vampir varsa gece vampirler arasında bir oylama mekanizması çalışır. Vampiler en çok oy alan oyuncuyu öldürmeye çalışır, eğer oylar eşit ise oy verdikleri kişiler arasından rastgele birini öldürürler.",
        "side": "vampir",
        "sidecolor": `red`
    },
    {
        "id": 4,
        "type": "Jester",
        "image": "/jester.png",
        "name": "Soytarı",
        "duties": ['Kendini astırmaya çalış'],
        "description": "Tarafsızdır, sadece karışıklık yaratır ve kendini oylamada astırmaya çalışır.",
        "description2": "Sabah oylamada asılırsa oyunu kazanır ama oyun yine de devam eder.",
        "side": "tarafsız",
        "sidecolor": `blue`
    },
    {
        "id": 5,
        "type": "Survivor",
        "image": "/survivor.png",
        "name": "Survivor",
        "duties": ['Hayatta kalmaya çalış'],
        "description": "Tarafsızdır, sadece oyun sonuna kadar hayatta kalmaya çalışır.",
        "description2": "Eğer oyun sonuna kadar hayatta kalırsa oyunu kazanır.",
        "side": "tarafsız",
        "sidecolor": `blue`
    },
    {
        "id": 5,
        "type": "Skip",
        "image": "jester.png",
        "name": "Boş Oy",
        "duties": ['Herkes rollerini gördüyse başlat'],
        "description": "Tarafsızdır, sadece karışıklık yaratır ve kendini oylamada astırmaya çalışır.",
        "side": "tarafsız",
        "sidecolor": `blue`
    }
]