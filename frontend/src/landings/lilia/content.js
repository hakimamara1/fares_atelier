// Every text and photo of the "lilia" landing page (Fares Atelier — Ensemble Lilia).
// Change them here to test another message.

export { SHOP_PHONE, FACEBOOK_PAGE } from '../../lib/shop';

export const images = {
    // No logo file yet: the page writes the brand name instead. Drop a Cloudinary URL here to use a picture.
    logo: '',
    // The hero photo is the default colour's own photo, taken from the product in the database.
    // index.html preloads exactly that file (product.colors[0].images[0]), so nothing is downloaded twice.
};

export const content = {
    brand: 'Fares Atelier',
    // Shown in the browser tab, and the order the colors appear in
    pageTitle: 'Ensemble Lilia',
    defaultColorName: 'Dusty Rose',
    colorOrder: ['Dusty Rose', 'Dark mauve', 'Charcoal Gray'],
    title: 'Ensemble Lilia — أناقة هادئة ليوميّاتك',
    subtitle: 'طقم كامل بقماش ناعم ودافئ — 3 ألوان، مقاسات من 38 إلى 48',
    priceNote: 'للطقم الكامل',
    cta: 'اطلبي الآن — الدفع عند الاستلام',
    deliveryNote: 'توصيل إلى جميع ولايات الوطن',

    // The pack chosen when the page opens
    defaultPack: 1,
    packs: [
        { quantity: 1, label: 'طقم واحد' },
        { quantity: 2, label: 'طقمين' },
    ],
    offersTitle: 'عروض خاصة',
    offersCta: 'أكملي طلبك',

    // Color names as saved on the product -> how the page shows them
    colorLabels: {
        'Dusty Rose': 'Dusty Rose',
        'Dark mauve': 'Dark Mauve',
        'Charcoal Gray': 'Charcoal Gray',
    },
    colorsTitle: 'الألوان المتوفرة',
    // Left empty on purpose: the page falls back to each colour's own photo in the database,
    // so changing a photo in the dashboard changes the landing page too.
    colorPhotos: {},
    // Colors that are finished: shown so she sees what the shop sells, never orderable
    soldOutColors: [],
    inStockLabel: 'متوفر',
    soldOutLabel: 'نفذت الكمية',

    sizesTitle: 'المقاسات المتوفرة',
    sizesNote: 'اختاري مقاسك عند إتمام الطلب',

    featuresTitle: 'علاش تحبّيه؟',
    featuresIntro: 'طقم واحد يوافق نهارك كامل — من الخرجة الصباحية حتى العشية.',
    features: [
        {
            title: 'قماش ناعم ودافئ',
            text: 'ما يحكّش وما يتكرمشش، يلبس مرتاح طول النهار ويبقى شكله مرتّب.',
        },
        {
            title: 'قصّة تليق بكل القوامات',
            text: 'واسعة شوية وتغطّي مليح، تخبّي اللي تحبّي تخبّي وتبان أنيقة بلا ما تضيّق عليك.',
        },
        {
            title: 'ثلاث ألوان مدروسة',
            text: 'Dusty Rose هادئ وأنثوي، Dark Mauve يميل للغامق، وCharcoal Gray كلاسيك يمشي مع كل شي.',
        },
        {
            title: 'مقاسات من 38 إلى 48',
            text: 'نتصلو بيك قبل الإرسال باش نتأكدو من المقاس معاك، وإذا ما جاش نبدلوه.',
        },
        {
            title: 'الدفع عند الاستلام',
            text: 'ما تخلصي والو قبل. تشوفي السلعة في يدك، وبعدها تخلصي عامل التوصيل.',
        },
        {
            title: 'توصيل لكل الولايات',
            text: 'من 24 إلى 48 ساعة، لباب الدار ولا لمكتب ZR Express اللي يناسبك.',
        },
    ],

    galleryTitle: 'من إطلالات Fares Atelier',
    gallery: [],

    formTitle: 'أكملي طلبك الآن',
    formSubtitle: 'الدفع عند الاستلام، في جميع ولايات الجزائر',
    formNote: 'ما تخلصيش حتى توصلك السلعة',

    // The small bar that follows her on the phone once she passes the hero
    stickyCta: 'اطلبي الآن',

    faqTitle: 'أسئلة شائعة',
    faq: [
        { q: 'كيفاش نخلص؟', a: 'تخلصي كاش لعامل التوصيل كي توصلك السلعة. ما تخلصي والو قبل.' },
        { q: 'قداش ياخذ التوصيل؟', a: 'من 24 إلى 48 ساعة، لباب الدار ولا لمكتب ZR Express اللي تختاريه.' },
        { q: 'قداش سعر التوصيل؟', a: 'يبان في الاستمارة كي تختاري الولاية والبلدية، بالسعر الحقيقي تاع ZR Express.' },
        {
            q: 'إذا المقاس ما جاش؟',
            a: 'نبدلوه لك بمقاس آخر وتخلصي غير مصاريف التوصيل. وباش ما يصراش، نتصلو بيك قبل ما نبعثو الطلب ونتأكدو من المقاس معاك.',
        },
        {
            q: 'واش كاين في الطلبية؟',
            a: 'طقم Ensemble Lilia كامل، بنفس اللون والمقاس اللي تختاري (38 / 40 / 42 / 44 / 46 / 48 حسب اللون). الإكسسوارات اللي في الصور ماشي داخلة في الطلبية.',
        },
        { q: 'واش هي الألوان المتوفرة؟', a: 'ثلاث ألوان: Dusty Rose و Dark Mauve و Charcoal Gray.' },
    ],

    tagline: 'إطلالات أنيقة لكل الجزائريات',
};
