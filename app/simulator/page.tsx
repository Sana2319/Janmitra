"use client";

import { useState, useEffect } from "react";
import { translations, Language } from "@/src/data/translations";

type StoryScenario = {
  round: number;
  titleEn: string;
  titleHi: string;
  titleBn: string;
  descEn: string;
  descHi: string;
  descBn: string;
  eduTitleEn: string;
  eduTitleHi: string;
  eduTitleBn: string;
  eduDescEn: string;
  eduDescHi: string;
  eduDescBn: string;
  options: {
    textEn: string;
    textHi: string;
    textBn: string;
    cost: number;
    impact: {
      water: number;
      roads: number;
      education: number;
      drainage: number;
      trust: number;
    };
  }[];
};

const storyScenarios: StoryScenario[] = [
  {
    round: 1,
    titleEn: "Drinking Water Contamination",
    titleHi: "पेयजल प्रदूषण संकट",
    titleBn: "খাবার জলের দূষণ সংকট",
    descEn: "Several families in Ward 2 fall sick due to pipeline contamination in the main drinking water tank. Urgent action is needed to stop the spread.",
    descHi: "मुख्य पेयजल टैंक की पाइपलाइन में गंदगी मिलने से वार्ड 2 के कई परिवार बीमार हो गए हैं। संक्रमण रोकने के लिए तत्काल कदम उठाने की जरूरत है।",
    descBn: "মূল পানীয় জলের ট্যাংকের পাইপলাইনে ময়লা ঢোকায় ২ নম্বর ওয়ার্ডের বেশ কিছু পরিবার অসুস্থ হয়ে পড়েছে। সংক্রমণ প্রতিরোধে তাত্ক্ষণিক পদক্ষেপ প্রয়োজন।",
    eduTitleEn: "Panchayat Responsibility: Water supply",
    eduTitleHi: "पंचायत उत्तरदायित्व: स्वच्छ पेयजल",
    eduTitleBn: "পঞ্চায়েতের দায়িত্ব: বিশুদ্ধ পানীয় জল",
    eduDescEn: "Under Article 243G (11th Schedule) of the Indian Constitution, supplying safe drinking water and maintaining handpumps is a primary responsibility of the Gram Panchayat.",
    eduDescHi: "भारतीय संविधान के अनुच्छेद 243G (11वीं अनुसूची) के तहत, सुरक्षित पेयजल की आपूर्ति करना और हैंडपंपों का रख-रखाव करना ग्राम पंचायत का प्राथमिक कर्तव्य है।",
    eduDescBn: "ভারতীয় সংবিধানের ২৪৩জি অনুচ্ছেদ (১১শ তফশিল) অনুযায়ী, বিশুদ্ধ পানীয় জল সরবরাহ করা এবং নলকূপের রক্ষণাবেক্ষণ করা গ্রাম পঞ্চায়েতের একটি প্রাথমিক দায়িত্ব।",
    options: [
      {
        textEn: "Complete Repair: Allocate 4 Lakhs for pipeline overhaul, new filter kits, and chlorine cleaning.",
        textHi: "पूर्ण मरम्मत: पाइपलाइन बदलने, नए फिल्टर किट लगाने और क्लोरीन सफाई के लिए 4 लाख रुपये आवंटित करें।",
        textBn: "সম্পূর্ণ মেরামত: পাইপলাইন বদল, নতুন ফিল্টার কিট এবং ক্লোরিন সাফাইয়ের জন্য ৪ লক্ষ টাকা বরাদ্দ করুন।",
        cost: 4,
        impact: { water: 30, roads: 0, education: 0, drainage: 5, trust: 20 }
      },
      {
        textEn: "Quick Fix: Distribute chlorine tablets and deploy water tankers for 1 Lakh.",
        textHi: "अस्थायी उपाय: क्लोरीन गोलियां बांटें और 1 लाख रुपये में पानी के टैंकर तैनात करें।",
        textBn: "সাময়িক ব্যবস্থা: ক্লোরিন ট্যাবলেট বিতরণ এবং ১ লক্ষ টাকায় জলের ট্যাঙ্কার মোতায়েন করুন।",
        cost: 1,
        impact: { water: 10, roads: 0, education: 0, drainage: 0, trust: 5 }
      },
      {
        textEn: "Postpone: Advise citizens to boil water and request state level water board grants (0 cost).",
        textHi: "विलंब करें: ग्रामीणों को पानी उबालने की सलाह दें और राज्य जल बोर्ड से अनुदान का अनुरोध करें (0 खर्च)।",
        textBn: "বিলম্ব করা: গ্রামবাসীদের জল ফুটিয়ে খাওয়ার পরামর্শ দিন এবং রাজ্য জল বোর্ডের অনুদানের আবেদন করুন (০ খরচ)।",
        cost: 0,
        impact: { water: -15, roads: 0, education: 0, drainage: 0, trust: -20 }
      }
    ]
  },
  {
    round: 2,
    titleEn: "Monsoon Flooding Risk",
    titleHi: "मानसून जलभराव का खतरा",
    titleBn: "বর্ষায় জলমগ্নতার ঝুঁকি",
    descEn: "Heavily clogged drainage channels threaten to flood the main market road, which would stall crop transit. The monsoon arrives in two weeks.",
    descHi: "कचरे से पटी नालियों के कारण मुख्य बाजार मार्ग में जलभराव का खतरा है, जिससे फसलों का परिवहन रुक सकता है। दो सप्ताह में मानसून आने वाला है।",
    descBn: "আবর্জনায় বুজে যাওয়া নর্দমার কারণে প্রধান বাজার এলাকায় বন্যার আশঙ্কা দেখা দিয়েছে, যা ফসল পরিবহনে বাধা সৃষ্টি করবে। দুই সপ্তাহের মধ্যে বর্ষা আসছে।",
    eduTitleEn: "Gram Sabha & Community Assets",
    eduTitleHi: "ग्राम सभा और सामुदायिक संपत्ति",
    eduTitleBn: "গ্রামসভা ও জঞ্জাল নিষ্কাশন",
    eduDescEn: "Gram Sabha discussions help prioritize drainage works before monsoons. Preventing road flooding is vital to protect community transport routes and trade.",
    eduDescHi: "मानसून से पहले जल निकासी कार्यों को प्राथमिकता देने में ग्राम सभा की चर्चा सहायक होती है। सड़कों पर जलभराव रोकना सामुदायिक परिवहन और व्यापार की रक्षा के लिए आवश्यक है।",
    eduDescBn: "বর্ষার আগে নর্দমা সংস্কারের কাজে অগ্রাধিকার দিতে গ্রামসভার আলোচনা সাহায্য করে। রাস্তাঘাট জলমগ্ন হওয়া প্রতিরোধ করা যাতায়াত ও ব্যবসার জন্য গুরুত্বপূর্ণ।",
    options: [
      {
        textEn: "Dredge and Asphalt: Clean all drainage channels and overlay potholed market roads for 5 Lakhs.",
        textHi: "गहरी सफाई और मरम्मत: सभी नालियों को साफ करें और बाजार की जर्जर सड़कों की मरम्मत के लिए 5 लाख रुपये आवंटित करें।",
        textBn: "সম্পূর্ণ সংস্কার: সমস্ত নর্দমা পরিষ্কার করুন এবং জরাজীর্ণ বাজার রাস্তা মেরামতের জন্য ৫ লক্ষ টাকা বরাদ্দ করুন।",
        cost: 5,
        impact: { water: 0, roads: 20, education: 0, drainage: 30, trust: 25 }
      },
      {
        textEn: "Basic Cleaning: Direct local laborers to clear blockages and dig sandbags check dams for 2 Lakhs.",
        textHi: "साधारण सफाई: स्थानीय मजदूरों को नाली साफ करने और मिट्टी की बोरियां लगाने के लिए 2 लाख रुपये दें।",
        textBn: "আংশিক সাফাই: স্থানীয় শ্রমিকদের নর্দমা পরিষ্কার এবং মাটির বস্তা দিয়ে বাঁধ তৈরিতে ২ লক্ষ টাকা বরাদ্দ করুন।",
        cost: 2,
        impact: { water: 0, roads: 5, education: 0, drainage: 15, trust: 10 }
      },
      {
        textEn: "Ignore: Request local shopkeepers to clean their frontages themselves (0 cost).",
        textHi: "उपेक्षा करें: स्थानीय दुकानदारों से स्वयं अपनी दुकान के सामने की नाली साफ करने को कहें (0 खर्च)।",
        textBn: "উপেক্ষা করা: স্থানীয় দোকানদারদের নিজেরাই নিজেদের দোকানের সামনের নর্দমা পরিষ্কার করতে বলুন (০ খরচ)।",
        cost: 0,
        impact: { water: 0, roads: -15, education: 0, drainage: -20, trust: -25 }
      }
    ]
  },
  {
    round: 3,
    titleEn: "Right to Information Request",
    titleHi: "सूचना का अधिकार (RTI) याचिका",
    titleBn: "তথ্য জানার অধিকার (RTI) আবেদন",
    descEn: "A youth association files a formal RTI petition demanding detailed expenditure bills for last year's road repairs. Preparing files requires administrative focus.",
    descHi: "युवा संगठन ने पिछले साल की सड़क मरम्मत के विस्तृत खर्च के बिल मांगने के लिए एक औपचारिक RTI याचिका दायर की है। फाइलों को तैयार करने में प्रशासनिक ध्यान चाहिए।",
    descBn: "একটি যুব সংগঠন গত বছরের রাস্তা মেরামতের খরচের বিল দেখতে চেয়ে আরটিআই (RTI) আবেদন জমা দিয়েছে। ফাইলপত্র সাজাতে প্রশাসনিক মনোযোগের প্রয়োজন।",
    eduTitleEn: "RTI Act & Local Transparency",
    eduTitleHi: "आरटीआई अधिनियम और स्थानीय पारदर्शिता",
    eduTitleBn: "আরটিআই আইন ও পঞ্চায়েতের স্বচ্ছতা",
    eduDescEn: "The RTI Act 2005 empowers citizens to inspect governance files and audit government spending. Transparency boosts trust and exposes leaks.",
    eduDescHi: "RTI अधिनियम 2005 नागरिकों को सरकारी फाइलों का निरीक्षण करने और सरकारी खर्च का ऑडिट करने की शक्ति देता है। पारदर्शिता से जनता का विश्वास बढ़ता है।",
    eduDescBn: "২০০৫ সালের আরটিআই আইন নাগরিকদের সরকারি ফাইল পরিদর্শন এবং পঞ্চায়েতের খরচের অডিট করার অধিকার দেয়। স্বচ্ছতা দুর্নীতি কমায় এবং আস্থা বাড়ায়।",
    options: [
      {
        textEn: "Full Disclosure: Publish all bills on the Panchayat website and display them on the notice board (1 Lakh cost).",
        textHi: "पूर्ण पारदर्शिता: सभी बिलों को पंचायत वेबसाइट पर अपलोड करें और नोटिस बोर्ड पर प्रदर्शित करें (1 लाख रुपये खर्च)।",
        textBn: "পূর্ণ স্বচ্ছতা: সমস্ত বিল পঞ্চায়েতের নোটিশ বোর্ড ও ওয়েবসাইটে প্রকাশ করুন (১ লক্ষ টাকা খরচ)।",
        cost: 1,
        impact: { water: 0, roads: 5, education: 0, drainage: 0, trust: 30 }
      },
      {
        textEn: "Standard Review: Deliver documents only to the applicant after charging standard photo-copy fees (0 cost).",
        textHi: "नियमित समीक्षा: केवल आवेदक को फोटोकॉपी शुल्क लेने के बाद फाइलें सौंपें (0 खर्च)।",
        textBn: "সাধারণ পর্যালোচনা: শুধুমাত্র আবেদনকারীকে জেরক্স ফি নিয়ে নথিপত্র বুঝিয়ে দিন (০ খরচ)।",
        cost: 0,
        impact: { water: 0, roads: 0, education: 0, drainage: 0, trust: 10 }
      },
      {
        textEn: "Deny and Block: Claim files are archived at the district collectorate to discourage scrutiny (0 cost).",
        textHi: "याचिका खारिज करें: जांच से बचने के लिए फाइलों को जिला मुख्यालय में जमा होने का बहाना बनाएं (0 खर्च)।",
        textBn: "আবেদন নাকচ করা: তদন্ত এড়াতে ফাইলগুলি জেলা সদরে আর্কাইভ করা আছে বলে দাবি করুন (০ খরচ)।",
        cost: 0,
        impact: { water: 0, roads: -5, education: -5, drainage: 0, trust: -25 }
      }
    ]
  },
  {
    round: 4,
    titleEn: "Primary School Infrastructure",
    titleHi: "प्राथमिक विद्यालय का बुनियादी ढांचा",
    titleBn: "প্রাথমিক বিদ্যালয়ের পরিকাঠামো",
    descEn: "Monsoon damage causes the ceiling plaster of the primary school classroom to crumble. Parents refuse to send kids to school due to safety fears.",
    descHi: "बारिश के कारण प्राथमिक स्कूल की छत का प्लास्टर टूटकर गिरने लगा है। सुरक्षा के डर से माता-पिता बच्चों को स्कूल भेजने से कतरा रहे हैं।",
    descBn: "বর্ষার ক্ষতির কারণে প্রাথমিক বিদ্যালয়ের ছাদের প্লাস্টার খসে পড়ছে। নিরাপত্তার ভয়ে অভিভাবকরা তাদের সন্তানদের স্কুলে পাঠাতে রাজি নন।",
    eduTitleEn: "Panchayat Powers: Primary Education",
    eduTitleHi: "पंचायत शक्तियां: प्राथमिक शिक्षा",
    eduTitleBn: "পঞ্চায়েতের ক্ষমতা: প্রাথমিক শিক্ষা",
    eduDescEn: "Managing and funding primary schools falls under Panchayat domains. Active maintenance ensures higher girl child enrollment and child safety.",
    eduDescHi: "प्राथमिक स्कूलों का प्रबंधन और वित्त पोषण करना पंचायतों के अधिकार क्षेत्र में आता है। समय पर रख-रखाव से छात्र-छात्राओं का नामांकन और सुरक्षा सुनिश्चित होती है।",
    eduDescBn: "প্রাথমিক বিদ্যালয় পরিচালনা ও রক্ষণাবেক্ষণ পঞ্চায়েতের কাজের আওতায় পড়ে। পরিকাঠামোর উন্নয়ন করলে পড়াশোনার মান ও ছাত্রছাত্রীদের নিরাপত্তা নিশ্চিত হয়।",
    options: [
      {
        textEn: "Complete Renovation: Reconstruct school roof, repaint classrooms, install fans, and buy library books for 3 Lakhs.",
        textHi: "पूर्ण कायाकल्प: स्कूल की छत की मरम्मत, पेंटिंग, पंखे लगवाने और पुस्तकालय की किताबें खरीदने के लिए 3 लाख रुपये आवंटित करें।",
        textBn: "বিদ্যালয় সংস্কার: ছাদ মেরামত, ক্লাসরুম রঙ করা, ফ্যান বসানো এবং লাইব্রেরি বই কিনতে ৩ লক্ষ টাকা বরাদ্দ করুন।",
        cost: 3,
        impact: { water: 0, roads: 0, education: 35, drainage: 0, trust: 25 }
      },
      {
        textEn: "Patchwork Repair: Patch up the ceiling cracks and paint the damaged area for 1 Lakh.",
        textHi: "आंशिक मरम्मत: छत की दरारों को भरें और क्षतिग्रस्त हिस्से की पुताई के लिए 1 लाख रुपये दें।",
        textBn: "সাময়িক মেরামত: ছাদের ফাটল মেরামত এবং প্লাস্টার জোড়াতালি দিতে ১ লক্ষ টাকা বরাদ্দ করুন।",
        cost: 1,
        impact: { water: 0, roads: 0, education: 15, drainage: 0, trust: 10 }
      },
      {
        textEn: "Ignore: Advise holding classes in the open courtyard until district education department funds arrive (0 cost).",
        textHi: "टालें: जिला शिक्षा विभाग से फंड आने तक कक्षाएं खुले मैदान में आयोजित करने की सलाह दें (0 खर्च)।",
        textBn: "উপেক্ষা করা: ব্লক শিক্ষা অফিস থেকে ফান্ড না আসা পর্যন্ত খোলা মাঠে ক্লাস করানোর পরামর্শ দিন (০ খরচ)।",
        cost: 0,
        impact: { water: 0, roads: 0, education: -20, drainage: 0, trust: -20 }
      }
    ]
  },
  {
    round: 5,
    titleEn: "Public Health Emergency",
    titleHi: "जन स्वास्थ्य आपातकाल",
    titleBn: "জনস্বাস্থ্য জরুরি অবস্থা",
    descEn: "A stagnant pond in Ward 4 spawns mosquito breeding, causing a dengue fever spike. The community demands sanitation and medical camps.",
    descHi: "वार्ड 4 के एक गंदे तालाब में मच्छर पनपने से डेंगू का प्रकोप बढ़ गया है। ग्रामीण फॉगिंग कराने और स्वास्थ्य शिविर लगाने की मांग कर रहे हैं।",
    descBn: "৪ নম্বর ওয়ার্ডের একটি নোংরা পুকুর মশাদের বংশবৃদ্ধির কারণ হয়েছে, ফলে ডেঙ্গুর প্রকোপ দেখা দিয়েছে। গ্রামবাসীরা ফগার মেশিন ও স্বাস্থ্য শিবিরের দাবি করছেন।",
    eduTitleEn: "Panchayat Healthcare Coordination",
    eduTitleHi: "स्वास्थ्य और स्वच्छता समन्वय",
    eduTitleBn: "স্বাস্থ্য ও স্যানিটেশন সমন্বয়",
    eduDescEn: "Gram Panchayats coordinate disease prevention drives, run sanitation operations, and distribute anti-malaria medicines in rural areas.",
    eduDescHi: "ग्राम पंचायतें ग्रामीण क्षेत्रों में संक्रामक रोगों की रोकथाम, कीटनाशक छिड़काव और मलेरिया-रोधी दवाओं के वितरण का समन्वय करती हैं।",
    eduDescBn: "গ্রাম পঞ্চায়েত সংক্রামক রোগ প্রতিরোধ, মশা মারার তেল স্প্রে এবং গ্রামীণ এলাকায় স্বাস্থ্য শিবির আয়োজনের নেতৃত্ব দেয়।",
    options: [
      {
        textEn: "Sanitation Drive: Clean the pond, spray larvicide, buy fogging equipment, and fund a doctor camp for 2 Lakhs.",
        textHi: "स्वच्छता अभियान: तालाब साफ कराएं, फॉगिंग मशीन खरीदें और डॉक्टरों का स्वास्थ्य शिविर लगाने के लिए 2 लाख रुपये दें।",
        textBn: "সম্পূর্ণ স্যানিটেশন: পুকুর পরিষ্কার, ফগার মেশিন ক্রয় এবং ডাক্তার শিবিরের জন্য ২ লক্ষ টাকা বরাদ্দ করুন।",
        cost: 2,
        impact: { water: 5, roads: 0, education: 0, drainage: 25, trust: 25 }
      },
      {
        textEn: "Emergency Spray: Deploy bleaching powder and spray mosquito killer sprays for 0.5 Lakh.",
        textHi: "आपातकालीन छिड़काव: केवल ब्लीचिंग पाउडर डालने और मच्छर मारक दवा छिड़कने के लिए 50,000 रुपये दें।",
        textBn: "জরুরি স্প্রে: পুকুরে ব্লিচিং পাউডার ও মশা মারার স্প্রে করার জন্য ৫০,০০০ টাকা বরাদ্দ করুন।",
        cost: 0.5,
        impact: { water: 0, roads: 0, education: 0, drainage: 10, trust: 10 }
      },
      {
        textEn: "Refer Out: Advise sick patients to travel 12km to the district hospital (0 cost).",
        textHi: "टालें: बीमार मरीजों को इलाज के लिए 12 किमी दूर जिला अस्पताल जाने की सलाह दें (0 खर्च)।",
        textBn: "এড়িয়ে যাওয়া: রোগীদের চিকিৎসা করাতে ১২ কিমি দূরে জেলা হাসপাতালে যাওয়ার পরামর্শ দিন (০ খরচ)।",
        cost: 0,
        impact: { water: 0, roads: 0, education: 0, drainage: -15, trust: -20 }
      }
    ]
  }
];

const quizQuestions = [
  {
    questionEn: "Who must approve the Gram Panchayat development plan and budget?",
    questionHi: "ग्राम पंचायत विकास योजना और बजट को कौन अनुमोदित करता है?",
    questionBn: "গ্রাম পঞ্চায়েতের উন্নয়ন পরিকল্পনা ও বাজেট কার অনুমোদন করতে হবে?",
    optionsEn: ["Block Development Officer", "Gram Sabha (Citizen Assembly)", "District Magistrate", "Panchayat Secretary"],
    optionsHi: ["खंड विकास अधिकारी", "ग्राम सभा (नागरिक सभा)", "जिलाधिकारी", "पंचायत सचिव"],
    optionsBn: ["ব্লক ডেভেলপমেন্ট অফিসার", "গ্রামসভা (নাগরিক সভা)", "জেলা শাসক", "পঞ্চায়েত সচিব"],
    answer: 1 // Gram Sabha
  },
  {
    questionEn: "Which schedule of the Indian Constitution lists the 29 subjects managed by Panchayats?",
    questionHi: "भारतीय संविधान की कौन सी अनुसूची पंचायतों द्वारा प्रबंधित 29 विषयों को सूचीबद्ध करती है?",
    questionBn: "ভারতীয় সংবিধানের কোন তফশিল পঞ্চায়েত দ্বারা পরিচালিত ২৯টি বিষয়ের তালিকা দেয়?",
    optionsEn: ["9th Schedule", "10th Schedule", "11th Schedule", "12th Schedule"],
    optionsHi: ["9वीं अनुसूची", "10वीं अनुसूची", "11वीं अनुसूची", "12वीं अनुसूची"],
    optionsBn: ["৯ম তফশিল", "১০ম তফশিল", "১১শ তফশিল", "১২শ তফশিল"],
    answer: 2 // 11th Schedule
  },
  {
    questionEn: "Under the RTI Act 2005, within how many days must a Panchayat respond to a standard query?",
    questionHi: "RTI अधिनियम 2005 के तहत, एक पंचायत को कितने दिनों के भीतर सामान्य प्रश्न का उत्तर देना होगा?",
    questionBn: "আরটিআই (RTI) আইনের অধীনে, একটি পঞ্চায়েতকে কত দিনের মধ্যে জবাব দিতে হবে?",
    optionsEn: ["15 days", "30 days", "45 days", "60 days"],
    optionsHi: ["15 दिन", "30 दिन", "45 दिन", "60 दिन"],
    optionsBn: ["১৫ দিন", "৩০ দিন", "৪৫ দিন", "৬০ দিন"],
    answer: 1 // 30 days
  },
  {
    questionEn: "What is the minimum age to contest elections for a Gram Panchayat member or Sarpanch?",
    questionHi: "ग्राम पंचायत सदस्य या सरपंच का चुनाव लड़ने के लिए न्यूनतम आयु क्या है?",
    questionBn: "গ্রাম পঞ্চায়েত সদস্য বা সরপঞ্চ পদে প্রতিদ্বন্দ্বিতা করার জন্য ন্যূনতম বয়স কত?",
    optionsEn: ["18 years", "21 years", "25 years", "30 years"],
    optionsHi: ["18 वर्ष", "21 वर्ष", "25 वर्ष", "30 वर्ष"],
    optionsBn: ["১৮ বছর", "২১ বছর", "২৫ বছর", "৩০ বছর"],
    answer: 1 // 21 years
  },
  {
    questionEn: "Who forms the members of the Gram Sabha in a village?",
    questionHi: "एक गाँव में ग्राम सभा के सदस्य कौन होते हैं?",
    questionBn: "একটি গ্রামে গ্রামসভার সদস্য কারা হন?",
    optionsEn: ["Only landowners", "All residents aged 18+ registered in electoral rolls", "Only ward commissioners", "Panchayat elected leaders only"],
    optionsHi: ["केवल भूमि मालिक", "मतदाता सूची में पंजीकृत 18+ वर्ष के सभी ग्रामीण", "केवल वार्ड कमिश्नर", "केवल पंचायत के निर्वाचित नेता"],
    optionsBn: ["শুধুমাত্র জমির মালিকরা", "ভোটার তালিকায় নাম থাকা ১৮+ বয়সের সমস্ত ভোটার", "শুধুমাত্র ওয়ার্ড মেম্বাররা", "শুধুমাত্র পঞ্চায়েতের নির্বাচিত নেতারা"],
    answer: 1 // All registered voters
  }
];

export default function SimulatorPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("simulator");

  // Game Variables
  const [metrics, setMetrics] = useState({ water: 50, roads: 50, education: 50, drainage: 50 });
  const [budget, setBudget] = useState(12); // Treasury, start at 12 Lakhs
  const [approval, setApproval] = useState(50); // Public Trust, start at 50%
  const [gameRound, setGameRound] = useState(1);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Quiz Variables
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    const getLang = () => {
      const saved = localStorage.getItem("janmitra_lang") as Language;
      if (saved && (saved === "en" || saved === "hi" || saved === "bn")) {
        setLang(saved);
      }
    };
    getLang();
    window.addEventListener("janmitra_language_change", getLang);
    return () => window.removeEventListener("janmitra_language_change", getLang);
  }, []);

  const t = translations[lang] || translations["en"];

  // Restart game
  const resetGame = () => {
    setMetrics({ water: 50, roads: 50, education: 50, drainage: 50 });
    setBudget(12);
    setApproval(50);
    setGameRound(1);
    setSelectedOptionIdx(null);
    setShowExplanation(false);
    setGameOver(false);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizSelectedAnswer(null);
    setActiveTab("simulator");
  };

  const currentScenario = storyScenarios[gameRound - 1];

  const handleOptionSelect = (idx: number) => {
    if (showExplanation) return;
    
    const option = currentScenario.options[idx];
    if (budget < option.cost) {
      alert(lang === "hi" ? "इस निर्णय के लिए खजाने में पर्याप्त बजट नहीं है!" : lang === "bn" ? "এই সিদ্ধান্তের জন্য তহবিলে পর্যাপ্ত বাজেট নেই!" : "Insufficient budget in the treasury for this decision!");
      return;
    }
    setSelectedOptionIdx(idx);
  };

  const confirmDecision = () => {
    if (selectedOptionIdx === null) return;
    
    const option = currentScenario.options[selectedOptionIdx];
    
    // Deduct cost and apply impacts
    setBudget(prev => Math.max(0, prev - option.cost));
    setApproval(prev => Math.max(0, Math.min(100, prev + option.impact.trust)));
    
    setMetrics(prev => ({
      water: Math.max(0, Math.min(100, prev.water + option.impact.water - 3)), // -3 is natural decay per round
      roads: Math.max(0, Math.min(100, prev.roads + option.impact.roads - 3)),
      education: Math.max(0, Math.min(100, prev.education + option.impact.education - 3)),
      drainage: Math.max(0, Math.min(100, prev.drainage + option.impact.drainage - 3))
    }));

    setShowExplanation(true);
  };

  const proceedNext = () => {
    setSelectedOptionIdx(null);
    setShowExplanation(false);

    if (gameRound < 5) {
      setGameRound(prev => prev + 1);
    } else {
      setGameOver(true);
      setActiveTab("results");
    }
  };

  // Quiz Handling
  const handleQuizAnswer = (selectedIdx: number) => {
    if (quizSelectedAnswer !== null) return;
    
    setQuizSelectedAnswer(selectedIdx);
    if (selectedIdx === quizQuestions[currentQuestion].answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizSelectedAnswer(null);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Get scorecard feedback
  const getScorecardGrade = () => {
    const avgHealth = (metrics.water + metrics.roads + metrics.education + metrics.drainage) / 4;
    const finalScore = (avgHealth + approval) / 2;

    if (finalScore >= 75) return { grade: "A", title: lang === "hi" ? "आदर्श सरपंच (Visionary Leader)" : lang === "bn" ? "আদর্শ সরপঞ্চ (Visionary Leader)" : "Adarsh Sarpanch (Visionary Leader)", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (finalScore >= 50) return { grade: "B", title: lang === "hi" ? "जिम्मेदार प्रशासक (Responsible Leader)" : lang === "bn" ? "দায়িত্বশীল প্রশাসক (Responsible Leader)" : "Responsible Administrator", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { grade: "C", title: lang === "hi" ? "संघर्षशील नेतृत्व (Struggling Leader)" : lang === "bn" ? "অদক্ষ নেতৃত্ব (Struggling Leader)" : "Struggling Administrator", color: "text-rose-600 bg-rose-50 border-rose-200" };
  };

  const cardGrade = getScorecardGrade();

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Tabs navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100/80 p-0.5 rounded-xl flex border border-slate-200/50 text-xs shadow-inner">
            <button
              onClick={() => !gameOver && setActiveTab("simulator")}
              disabled={gameOver}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                activeTab === "simulator"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-950 cursor-pointer disabled:opacity-50"
              }`}
            >
              🎮 {t.simulator.title}
            </button>
            <button
              onClick={() => gameOver && setActiveTab("results")}
              disabled={!gameOver}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                activeTab === "results"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-950 cursor-pointer disabled:opacity-50"
              }`}
            >
              🏆 {t.simulator.finalTitle}
            </button>
            <button
              onClick={() => gameOver && setActiveTab("quiz")}
              disabled={!gameOver}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                activeTab === "quiz"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-950 cursor-pointer disabled:opacity-50"
              }`}
            >
              📚 {t.simulator.quizTitle}
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200/60 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            {t.simulator.badge}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.simulator.title}
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl">
            {t.simulator.desc}
          </p>
        </div>

        {/* Active game view */}
        {activeTab === "simulator" && (
          <div className="space-y-8">
            {/* HUD Dashboard */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.02)]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.simulator.roundsTitle}</span>
                <p className="mt-1 text-xl font-extrabold text-slate-900">{gameRound} / 5</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.02)]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.simulator.trustTitle}</span>
                <p className="mt-1 text-xl font-extrabold text-emerald-600">{approval}%</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.02)]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.simulator.budgetRemaining}</span>
                <p className="mt-1 text-xl font-extrabold text-slate-900">₹{budget} Lakh</p>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Left column: Village health stats */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.02)] space-y-5">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.simulator.metricsTitle}
                </h2>

                <div className="space-y-4 pt-1">
                  {[
                    { name: lang === "hi" ? "💧 जल आपूर्ति" : lang === "bn" ? "💧 জল সরবরাহ" : "💧 Water Supply", value: metrics.water, color: "from-blue-500 to-indigo-500" },
                    { name: lang === "hi" ? "🛣️ सड़क संपर्क" : lang === "bn" ? "🛣️ সড়ক ব্যবস্থা" : "🛣️ Road Networks", value: metrics.roads, color: "from-orange-400 to-amber-500" },
                    { name: lang === "hi" ? "🏫 प्राथमिक शिक्षा" : lang === "bn" ? "🏫 প্রাথমিক শিক্ষা" : "🏫 Primary School", value: metrics.education, color: "from-green-500 to-emerald-500" },
                    { name: lang === "hi" ? "🚰 जल निकासी" : lang === "bn" ? "🚰 জল নিষ্কাশন" : "🚰 Drainage System", value: metrics.drainage, color: "from-violet-500 to-fuchsia-500" },
                  ].map((m, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs font-semibold text-slate-600">
                        <span>{m.name}</span>
                        <span className="font-bold text-slate-900">{m.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: Scenario cards */}
              <div className="md:col-span-7 space-y-6">
                {/* Active Event */}
                <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] border-l-4 border-l-indigo-600 space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">
                      {t.simulator.eventTitle}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {lang === "hi" ? currentScenario.titleHi : lang === "bn" ? currentScenario.titleBn : currentScenario.titleEn}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {lang === "hi" ? currentScenario.descHi : lang === "bn" ? currentScenario.descBn : currentScenario.descEn}
                  </p>
                </div>

                {/* Strategy choices */}
                <div className="space-y-3.5">
                  {currentScenario.options.map((opt, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5
                          ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-300 shadow-sm"
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                          }
                          ${showExplanation ? "cursor-default opacity-85" : "cursor-pointer active:scale-[0.99]"}
                        `}
                      >
                        <div className={`h-5 w-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold
                          ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-slate-800 text-xs font-bold leading-normal">
                            {lang === "hi" ? opt.textHi : lang === "bn" ? opt.textBn : opt.textEn}
                          </p>
                          <div className="flex gap-2.5 flex-wrap">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              🪙 Cost: ₹{opt.cost} Lakh
                            </span>
                            {/* Impacts info preview */}
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              📊 Impact Preview
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions / Educational Card */}
                <div className="pt-2">
                  {!showExplanation ? (
                    <button
                      onClick={confirmDecision}
                      disabled={selectedOptionIdx === null}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 transition active:scale-[0.98] cursor-pointer"
                    >
                      {t.simulator.submitBtn}
                    </button>
                  ) : (
                    <div className="space-y-5 animate-fadeIn">
                      {/* Educational callout */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-2 border-l-4 border-l-indigo-600">
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">
                          📝 {lang === "hi" ? currentScenario.eduTitleHi : lang === "bn" ? currentScenario.eduTitleBn : currentScenario.eduTitleEn}
                        </span>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {lang === "hi" ? currentScenario.eduDescHi : lang === "bn" ? currentScenario.eduDescBn : currentScenario.eduDescEn}
                        </p>
                      </div>

                      <button
                        onClick={proceedNext}
                        className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition active:scale-[0.98] cursor-pointer animate-pulse"
                      >
                        {lang === "hi" ? "अगले राउंड पर जाएं →" : lang === "bn" ? "পরবর্তী রাউন্ডে যান →" : "Proceed to Next Round →"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {activeTab === "results" && gameOver && (
          <div className="space-y-8 animate-fadeIn text-center">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg space-y-6 max-w-2xl mx-auto border-t-8 border-t-indigo-600">
              <div className="text-5xl">🏆</div>
              <h2 className="text-2.5xl font-extrabold text-slate-900 tracking-tight">
                {t.simulator.finalTitle}
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                {lang === "hi"
                  ? "आपने 5 महत्वपूर्ण राउंड पूरे कर लिए हैं। यहाँ आपकी पंचायत विकास स्कोर रिपोर्ट और ग्रेड है।"
                  : lang === "bn"
                  ? "আপনি ৫টি গুরুত্বপূর্ণ রাউন্ড সম্পন্ন করেছেন। এখানে আপনার পঞ্চায়েত উন্নয়ন রিপোর্ট ও গ্রেড দেওয়া হলো।"
                  : "You have completed 5 critical administrative rounds. Below is your village development scorecard."}
              </p>

              {/* Certificate Details */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">🤝 {t.simulator.trustTitle}</span>
                  <span className="text-lg font-bold text-indigo-600">{approval}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">🪙 Remaining Treasury</span>
                  <span className="text-lg font-bold text-slate-800">₹{budget} Lakh</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Village Grade Certificate</span>
                    <span className="text-xs font-bold text-slate-900">{cardGrade.title}</span>
                  </div>
                  <span className={`h-11 w-11 rounded-full flex items-center justify-center text-lg font-extrabold border ${cardGrade.color}`}>
                    {cardGrade.grade}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 rounded-xl border border-slate-300 hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
                >
                  🔄 Restart Challenge
                </button>
                <button
                  onClick={() => {
                    setQuizStarted(true);
                    setActiveTab("quiz");
                  }}
                  className="flex-1 rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition cursor-pointer"
                >
                  📚 {t.simulator.startQuiz}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Screen */}
        {activeTab === "quiz" && (
          <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
            {!quizCompleted ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
                {/* Question progress */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                    {t.simulator.quizTitle}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {lang === "hi"
                    ? quizQuestions[currentQuestion].questionHi
                    : lang === "bn"
                    ? quizQuestions[currentQuestion].questionBn
                    : quizQuestions[currentQuestion].questionEn}
                </h3>

                {/* Answer choices */}
                <div className="space-y-3">
                  {(lang === "hi"
                    ? quizQuestions[currentQuestion].optionsHi
                    : lang === "bn"
                    ? quizQuestions[currentQuestion].optionsBn
                    : quizQuestions[currentQuestion].optionsEn
                  ).map((option, idx) => {
                    const isSelected = quizSelectedAnswer === idx;
                    const isCorrect = idx === quizQuestions[currentQuestion].answer;
                    const hasAnswered = quizSelectedAnswer !== null;

                    let btnClass = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
                      } else if (isSelected) {
                        btnClass = "bg-rose-50 border-rose-300 text-rose-800 font-bold";
                      } else {
                        btnClass = "opacity-50 border-slate-100";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={hasAnswered}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-semibold flex items-center justify-between gap-4 ${btnClass} ${!hasAnswered ? "cursor-pointer active:scale-[0.99]" : "cursor-default"}`}
                      >
                        <span>{option}</span>
                        {hasAnswered && isCorrect && <span className="text-emerald-600 font-bold text-sm">✓</span>}
                        {hasAnswered && isSelected && !isCorrect && <span className="text-rose-600 font-bold text-sm">✗</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                {quizSelectedAnswer !== null && (
                  <button
                    onClick={nextQuizQuestion}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition active:scale-[0.98] cursor-pointer animate-fadeIn"
                  >
                    {currentQuestion < quizQuestions.length - 1
                      ? (lang === "hi" ? "अगला प्रश्न" : lang === "bn" ? "পরবর্তী প্রশ্ন" : "Next Question")
                      : (lang === "hi" ? "परिणाम देखें" : lang === "bn" ? "ফলাফল দেখুন" : "View Quiz Results")}
                  </button>
                )}
              </div>
            ) : (
              // Quiz Completed screen
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg space-y-6">
                <div className="text-5xl">🎓</div>
                <h2 className="text-2.5xl font-extrabold text-slate-900 tracking-tight">
                  Quiz Completed
                </h2>
                <p className="text-slate-500 text-xs">
                  {lang === "hi"
                    ? "स्थानीय शासन और नागरिक अधिकारों के बारे में आपके ज्ञान का अंतिम स्कोर।"
                    : lang === "bn"
                    ? "স্থানীয় শাসন এবং নাগরিক অধিকার সম্পর্কে আপনার অর্জিত স্কোরের বিবরণ।"
                    : "Your learning scorecard testing local governance rules and rights."}
                </p>

                <div className="max-w-xs mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    {t.simulator.scoreTitle}
                  </span>
                  <span className="text-4xl font-extrabold text-indigo-600 tracking-tight mt-1.5 block">
                    {quizScore} / {quizQuestions.length}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetGame}
                    className="flex-1 rounded-xl border border-slate-300 hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
                  >
                    🔄 Play Challenge Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}