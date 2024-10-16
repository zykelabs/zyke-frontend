"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  Hash,
  Image,
  Youtube,
  Globe,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const contentTypes = [
  { value: "trend", label: "Trend", icon: TrendingUp },
  { value: "blog", label: "Blog", icon: Hash },
  { value: "instagram_post", label: "Instagram Post", icon: Image },
  { value: "news_article", label: "News Article", icon: Globe },
  { value: "tweet", label: "Tweet", icon: Hash },
  { value: "linkedin_post", label: "LinkedIn Post", icon: Hash },
  { value: "product_image", label: "Product Image", icon: Image },
  { value: "reel", label: "Reel", icon: Youtube },
  { value: "youtube_video", label: "YouTube Video", icon: Youtube },
  { value: "text_prompt", label: "Text / Prompt", icon: Hash },
  { value: "hashtag", label: "Hashtags", icon: Hash },
  { value: "website", label: "Website", icon: Globe },
];

const contentTypeDescriptions = {
  trend: "Generate trending social media topics from the latest trends.",
  blog: "Create engaging social media topics from blog content.",
  instagram_post: "Generate social media topics based on Instagram posts.",
  news_article:
    "Turn news articles into social media topics that spark conversations.",
  tweet: "Generate social media topics based on existing tweets.",
  linkedin_post: "Create social media topics from professional LinkedIn posts.",
  product_image:
    "Generate topic ideas for social media based on product images.",
  reel: "Turn Instagram Reels into social media topic ideas.",
  youtube_video: "Create social media topics based on YouTube video content.",
  text_prompt: "Generate social media topics from text prompts or ideas.",
  hashtag: "Create social media topics from trending hashtags.",
  website: "Generate social media topics from website content and updates.",
};

// Updated fetchTrends function with all trends and their long descriptions
const fetchTrends = async () => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      trend: "IND vs NZ",
      shortDescription: "Cricket match between India and New Zealand",
      longDescription: `The trend "IND vs NZ" is trending due to the upcoming Test series between India and New Zealand, as well as the recent Women's T20 World Cup match where New Zealand defeated India, securing their semi-final spot.

**India vs New Zealand (IND vs NZ)**

The Indian cricket team is set to face New Zealand in a Test series, with the first match scheduled to take place in Bengaluru. However, the weather forecast suggests a constant drizzle, which may cause flooding and traffic woes in the city.

The Indian team is keen on building a pace-bowling bench strength for their upcoming tour of Australia, with Rohit Sharma expressing his desire to have a strong pace attack. The team is also keen on creating a bench strength in other departments, including batting and spin bowling.

In the Women's T20 World Cup 2024, the Indian women's cricket team suffered a shocking defeat against New Zealand, losing from a winning position. The match was a chaotic spectacle, with India striking a familiar pattern of jangling nerves and losing from a winning position.

New Zealand showed great composure and discipline to secure their first T20 World Cup semi-final spot in eight years. Pakistan, who were also in contention, dropped eight catches and succumbed to pressure, ultimately losing to New Zealand.

**Other News**

The Indian government has downgraded diplomatic ties with Canada and recalled the High Commissioner. This move comes after a series of incidents involving Indian diplomats in Canada. The Indian government has also expelled six Canadian diplomats from the country.

In other sports news, the Hockey India League auction has taken place, with several top players being bought by teams. The auction was held in New Delhi, with teams competing to sign the best players for their squads.

Overall, it has been a busy day in the world of sports, with several big matches and transfers taking place.`,
    },
    {
      trend: "Germany vs Netherlands",
      shortDescription: "Football match between Germany and Netherlands",
      longDescription: `**Germany vs Netherlands: Germany Wins 1-0 in UEFA Nations League Clash**

Germany secured a crucial 1-0 victory over Netherlands in their UEFA Nations League clash at the Allianz Arena on Monday evening. The match saw a tribute to the old guard of German football, with legends Manuel Neuer, Toni Kroos, Ilkay Gundogan, and Thomas Muller honored before the game.

The winning goal was scored by Jamie Leweling in the 64th minute, which sent Julian Nagelsmann's Germany to the top of their Nations League group. The match was a closely contested affair, with both teams creating scoring opportunities.

The Netherlands had a few chances, but Germany's defense held strong, and they were able to capitalize on a mistake by the Dutch team. Leweling's goal proved to be the decisive moment in the match, and Germany held on for the win.

The victory moves Germany to the top of their Nations League group, with 10 points from four matches. Netherlands remain in second place with 5 points, while Hungary and Bosnia and Herzegovina are third and fourth, respectively.

**Key Statistics:**

* Germany won 1-0 against Netherlands in the UEFA Nations League clash.
* Jamie Leweling scored the winning goal in the 64th minute.
* Germany moved to the top of their Nations League group with 10 points from four matches.
* Netherlands remain in second place with 5 points.
* The match saw a few yellow cards, including one for Germany's Antonio Rüdiger and two for Netherlands' Matthijs de Ligt and Xavi Simons.
* There were a few substitutions made by both teams, but none of them had a significant impact on the outcome of the match.

**Additional Information:**

* Bayern Munich star Joshua Kimmich praised Jamie Leweling's performance in the match.
* The Netherlands has produced more valuable players in the UEFA Nations League A, with 8 French players making the top XI.
* The match was marked by a few yellow cards, including one for Germany's Antonio Rüdiger and two for Netherlands' Matthijs de Ligt and Xavi Simons.
* There were a few substitutions made by both teams, but none of them had a significant impact on the outcome of the match.

**Complete Picture:**

The article provides a comprehensive summary of the UEFA Nations League match between Germany and Netherlands, including the winning goal, key statistics, and additional information about the teams and players. The match was a closely contested affair, with both teams creating scoring opportunities, but Germany's defense held strong, and they were able to capitalize on a mistake by the Dutch team. The victory moves Germany to the top of their Nations League group, with 10 points from four matches.`,
    },
    {
      trend: "अतुल परचुरे",
      shortDescription: "Veteran Marathi actor passes away",
      longDescription: `Here is a summary of the trend:

**Atul Parchure Passes Away**

Atul Parchure, a veteran Marathi actor known for his comedy roles in Hindi and Marathi films, has passed away at the age of 57. He died after a long battle with cancer. Parchure was a popular figure in the Marathi film industry and will be remembered for his contributions to Marathi cinema. He was also a part of the popular TV show "The Kapil Sharma Show", where he played different roles. Maharashtra Chief Minister Eknath Shinde has paid his tributes to the actor, saying his untimely death is painful. The news of his passing has been met with tributes from the film industry, with many expressing their condolences and sharing memories of his work.`,
    },
    {
      trend: "राशन कार्ड",
      shortDescription: "Updates on ration card policies",
      longDescription: `The topic of राशन कार्ड (Ration Card) is trending due to various updates and changes in the government's policies and schemes related to ration cards. Here is a summary of the key points:

* The government has introduced new rules for ration card holders, which require certain individuals to surrender their ration cards if they are found to be ineligible.
* The government has also launched a new app called "Mera Ration 2.0" that allows users to make changes to their ration card details online.
* Ration card holders will now be able to obtain their ration cards without visiting the ration shop or society, making the process more convenient and hassle-free.
* The government has also announced that ration card holders will receive additional benefits from October, including access to more essential commodities at subsidized rates.
* The BPL Ration Card, which is a type of ration card provided to Below Poverty Line (BPL) families, is being discussed widely, and it is now easier to obtain a free ration card.

Overall, the government's efforts to update and improve the ration card system aim to provide more benefits and convenience to eligible individuals and families, particularly those living below the poverty line.`,
    },
    {
      trend: "Angel One Share Price",
      shortDescription: "Stock market updates for Angel One",
      longDescription: `**Angel One Share Price Trend:**

Angel One's share price has been in focus due to its strong Q2 performance, with the company reporting a 39% year-over-year (YoY) rise in net profit at Rs 423.4 crore for the September 2024 quarter. The company's revenue increased by 44.5% to Rs 1,514.7 crore during the same period. Angel One's total client base increased by 61% to 27.5 million, while its share in India's demat accounts increased by 251 basis points YoY to 15.7% for the quarter that ended on September 30.

The company's financial performance was driven by a significant increase in its revenue, which was attributed to a rise in trading volumes and a growth in its client base. Angel One's net profit margin also improved during the quarter, indicating more efficient operations.

In terms of share price, Angel One's stock may be influenced by the company's financial performance and the overall market trends. The article mentions that Angel One will be one of the stocks in focus on Tuesday, October 15, 2024, along with other companies such as Reliance Industries, HCL Tech, Garuda Construction, JSW Infra, IOB, Zydus Life, and CESC, which will be announcing their Q2FY25 results.

**Current Share Price:**

The current share price of Angel One is not explicitly mentioned in the articles. However, based on the information provided, it can be inferred that the share price has been on the rise due to the company's strong Q2 performance.

**Market Trends:**

The overall market trends seem to be weak, with the Nifty IT index falling 0.02% in a weak market. However, Angel One's share price has surged over 14% on strong Q2 performance, indicating a positive trend in the company's stock.

**Peers:**

Angel One's top 5 peers in the Financials sector are Motil.Oswal.Fin., ICICI Securities, Nuvama Wealth, and IIFL Securities.

**Conclusion:**

Angel One's share price has been in focus due to its strong Q2 performance, with the company reporting a 39% year-over-year (YoY) rise in net profit. The company's financial performance was driven by a significant increase in its revenue, which was attributed to a rise in trading volumes and a growth in its client base. The current share price of Angel One is not explicitly mentioned, but it can be inferred that the share price has been on the rise due to the company's strong Q2 performance.`,
    },
    {
      trend: "Sharad Purnima Kab Hai",
      shortDescription: "Date and details of Sharad Purnima festival",
      longDescription: `Sharad Purnima 2024: शरद पूर्णिमा कब है 16 या 17 अक्टूबर? नोट कर लें सही डेट, मुहूर्त, पूजा विधि और खीर रखने का समय

**Sharad Purnima 2024 Date Time:** शरद पूर्णिमा 16 अक्टूबर 2024, बुधवार को मनाई जाएगी। पूर्णिमा तिथि 16 अक्टूबर की रात 08:40 से 17 अक्टूबर की शाम 04:55 तक रहेगी।

**Sharad Purnima 2024 Puja Muhurat:** शरद पूर्णिमा के दिन लक्ष्मी पूजा का निशिता काल मुहूर्त रात 11 बजकर 42 मिनट से रात 12 बजकर 32 मिनट तक रहेगा।

**Sharad Purnima 2024 Khir Rakhne Ka Samay:** शरद पूर्णिमा के दिन खीर रखने का समय रात 8 बजकर 40 मिनट से शुरू होगा। इससे पहले ही खीर बनाकर तैयार कर लें।

**Sharad Purnima 2024 Moon Rise Time:** शरद पूर्णिमा के दिन चांद शाम 5 बजकर 5 मिनट पर निकलेगा।

**Sharad Purnima Puja Vidhi:** अगर शरद पूर्णिमा के दिन व्रत रख रहे हैं तो इस दिन सुबह जल्दी उठकर स्नान कर स्वच्छ वस्त्र धारण करें। इसके बाद व्रत का संकल्प लें। जहां पूजा करनी है उस स्थान को साफ करें और वहां अपने आराध्य देव की मूर्ति या तस्वीर स्थापित करें। वैसे शरद पूर्णिमा के दिन मां लक्ष्मी, भगवान शिव-पार्वती और भगवान कार्तिकेय की पूजा होती है। इसके बाद वस्त्र, गंध, दीप, नैवेद्य, तांबूल, अक्षत, पुष्प, धूप, सुपारी और दक्षिणा अर्पित करें। शरद पूर्णिमा की कथा सुनें। लेकिन ध्यान रहे कथा से पहले एक लोटे में जल रखें और साथ ही गिलास में गेहूं, पत्ते के दोने में रोली और चावल रखकर कलश की वंदना करें और साथ ही दक्षिणा चढ़ाएं। रात में दूध की खीर बनाएं और उसे चांद की रोशनी में रख दें। फिर इस खीर को अगले दिन प्रसाद रूप में ग्रहण करें।`,
    },
    {
      trend: "PAK vs NZ",
      shortDescription: "Cricket match between Pakistan and New Zealand",
      longDescription: `Here is a summary of the information provided:

**Topic: PAK vs NZ**

The topic is about a cricket match between Pakistan (PAK) and New Zealand (NZ). 

**Summary:**

New Zealand has defeated Pakistan by 54 runs in the Women's T20 World Cup, securing their spot in the semi-finals. This result has also knocked India out of the tournament. The match was a closely contested one, with both teams giving their best. However, Pakistan's poor fielding and batting display ultimately led to their downfall. New Zealand capitalized on Pakistan's mistakes and secured a well-deserved victory.

This win marks a significant milestone for the New Zealand women's team, who have been working hard to regain their form. The team's coach has expressed his satisfaction with the players' performance, stating that they have been working together as a unit and are now reaping the rewards.

The win has also sent a strong message to the other teams in the tournament, showcasing New Zealand's capabilities and determination. The team will now look to build on this momentum and make a deep run in the tournament.

In related news, India succumbed to chaos in their match against Australia, striking a familiar pattern of jangling nerves and losing from a winning position. India's coach expressed his satisfaction with the players' performance, stating that they couldn't have asked for more.

The Women's T20 World Cup 2024 is an ongoing tournament, with several teams still in the running. The competition is expected to be fierce, with each team vying for a spot in the semi-finals. The tournament is being closely watched by fans and experts alike, who are eager to see which team will emerge victorious.`,
    },
    {
      trend: "Atul Parchure Death",
      shortDescription: "News about actor Atul Parchure's passing",
      longDescription: `Here is a summary of the trend:

**Atul Parchure Passes Away**

Veteran Marathi actor Atul Parchure has passed away at the age of 57. He was known for his comic roles in Hindi and Marathi films. Parchure's death has sent shockwaves through the entertainment industry, with many celebrities taking to social media to pay their tributes. He was a part of several notable films, including "Navra Mazha Navsacha," "Salaam-E-Ishq," "Partner," "All the Best: Fun Begins," "Khatta Meetha," "Bbuddah... Hoga Terra Baap," and "Brave Heart." Parchure also appeared in the popular TV show "The Kapil Sharma Show." Maharashtra Chief Minister Eknath Shinde has paid his tributes to the seasoned actor, calling his untimely death "painful."`,
    },
    {
      trend: "APJ Abdul Kalam",
      shortDescription: "Birth anniversary tributes to APJ Abdul Kalam",
      longDescription: `**APJ Abdul Kalam: A Tribute to the Missile Man of India**

APJ Abdul Kalam, the 11th President of India, is being remembered on his birth anniversary, October 15. Kalam was a renowned scientist, engineer, and statesman who played a significant role in India's space and missile programs. He was a strong advocate for education, innovation, and rural development, and his legacy continues to inspire Indians and people around the world.

Kalam was born on October 15, 1931, in Rameswaram, Tamil Nadu, and grew up in a poor family. He studied physics and aerospace engineering and went on to become a leading scientist in India's space program. He played a crucial role in the development of India's first indigenous satellite launch vehicle, SLV-3, and the Pokhran-II nuclear test.

As President, Kalam focused on promoting education, innovation, and rural development. He was known for his simplicity, humility, and commitment to public service. He passed away on July 27, 2015, but his legacy continues to inspire Indians and people around the world.

On his birth anniversary, people are paying tribute to Kalam's contributions to India's development and his inspiring life story. His quotes and sayings continue to motivate people, especially students, to strive for excellence and make a positive impact in their communities.

World Students' Day is also celebrated on October 15, marking Kalam's birth anniversary. The day is a tribute to his commitment to education and his vision for a developed India. Netizens are sharing greetings, messages, images, wallpapers, quotes, and motivational sayings to celebrate World Students' Day and pay tribute to Kalam's legacy.

Overall, APJ Abdul Kalam's life and legacy serve as a source of inspiration for people around the world. His commitment to education, innovation, and public service continues to motivate and inspire future generations of leaders and citizens.`,
    },
    {
      trend: "Hyundai IPO GMP",
      shortDescription: "Hyundai's IPO Grey Market Premium updates",
      longDescription: `Hyundai Motor India's Initial Public Offering (IPO) has opened for subscription, with the company offering shares in the range of Rs 1,865-1,960 apiece. The IPO is entirely an offer for sale by South Korean auto major Hyundai Motor Company, which will offload up to 14,21,94,700 equity shares. The issue includes a reservation of 7,78,400 equity shares for eligible employees of the company, who will get a discount of Rs 186 per share.

The Grey Market Premium (GMP) for Hyundai Motor India has been falling consistently, suggesting a minuscule listing pop for investors. Some analysts have expressed concerns over the rich valuations of the company, with StoxBox saying that the recent depletion of Hyundai Motor India's cash and bank balances following hefty dividends to its South Korean parent raises doubts about its expansion plans.

Despite this, the company is aiming to raise Rs 27,856 crore at the upper price band of Rs 1,960 per share. The IPO will open for bidding between October 15-17, with investors able to apply for a minimum of 7 shares and its multiples thereafter.

The company's management has said that it is aiming to raise funds for its expansion plans, including the launch of new electric vehicles. However, some analysts have expressed concerns over the company's ability to deliver on its growth plans, given its rich valuations and declining GMP.

Overall, the IPO has been met with a lukewarm response from investors, with the GMP correcting further on the first day of its opening. However, the company is still aiming to raise a significant amount of money through the IPO, which could be a positive sign for the company's growth plans.`,
    },
    {
      trend: "North Korean",
      shortDescription: "News related to North Korea",
      longDescription: `North Korea has blown up parts of the inter-Korean roads that are no longer in use, as tensions between North and South Korea continue to escalate. This move is seen as a response to South Korea's alleged drone flights over North Korea's capital, Pyongyang. The destruction of the roads is in line with North Korean leader Kim Jong Un's efforts to cut off ties with South Korea and formally declare it as his country's principal enemy.

The inter-Korean roads were previously reconnected during a period of detente in the 2000s, but their operations were suspended due to disagreements over North Korea's nuclear program and other issues. The current tensions between the two countries have led to a significant escalation in animosity, with North Korea taking steps to strengthen its military and cut off ties with South Korea.

In addition to the destruction of the inter-Korean roads, North Korea has also been involved in other provocative actions, including the use of a new backdoor called VeilShell in cyber attacks. This backdoor allows North Korean hackers to gain remote access to compromised systems and steal sensitive information.

The situation remains volatile, with both sides engaging in a war of words and actions. The destruction of the inter-Korean roads is a significant development, as it marks a further deterioration in relations between the two countries and raises concerns about the potential for conflict.`,
    },
    {
      trend: "SpaceX",
      shortDescription: "SpaceX's Starship booster landing achievement",
      longDescription: `**SpaceX Makes History by Catching Giant Starship Booster**

SpaceX has achieved a historic milestone by successfully catching a giant Starship booster with a set of mechanical arms, known as "chopsticks," during the Flight 5 launch and landing test. This feat was accomplished on October 13, 2024, and has been widely acclaimed. The test flight was a remarkable achievement, marking a significant step forward in the development of the Starship rocket. Elon Musk, the CEO and founder of SpaceX, celebrated the event, highlighting the company's progress in pushing the boundaries of space technology.

The Starship rocket is a next-generation spacecraft designed to take humans to the moon, Mars, and other destinations in the solar system. The successful test flight demonstrates SpaceX's capabilities in developing and testing complex spacecraft systems. The company's ability to catch the returning booster at the launch pad using mechanical arms is a testament to its innovative approach to space technology.

This achievement is a significant milestone in SpaceX's journey to make humanity a multi-planetary species. The company's progress in developing the Starship rocket is a major step forward in the exploration of space and the potential for human settlement on other planets.

**Key Points:**

* SpaceX successfully caught a giant Starship booster with mechanical arms during the Flight 5 launch and landing test.
* The test flight was a historic milestone in the development of the Starship rocket.
* The successful catch demonstrates SpaceX's capabilities in developing and testing complex spacecraft systems.
* The Starship rocket is designed to take humans to the moon, Mars, and other destinations in the solar system.
* The achievement is a significant milestone in SpaceX's journey to make humanity a multi-planetary species.`,
    },
    {
      trend: "Canada",
      shortDescription: "Strained relations and other domestic news in Canada",
      longDescription: `Here is a summary of the information provided, focusing on the topic of Canada:

**Canada News and Trends**

Canada is currently experiencing a range of news and trends, including:

* **India-Canada Relations**: Relations between India and Canada have hit rock bottom, with both countries expelling top diplomats from each other's countries over a murder accusation.
* **Canadian Unemployment Rate**: The Canadian unemployment rate has accelerated, rising from a multi-decade low of 4.9% to 6.6% as of the latest reading.
* **Insurance Industry**: The Canadian insurance industry is experiencing significant developments, with several key announcements and trends emerging, including the introduction of new CEOs and the launch of claims insurtech SaaS platforms.
* **Toronto Concerts and Festivals**: Toronto is set to host a wide range of concerts and festivals in 2024 and 2025, with over 970 upcoming events.
* **Canadian Politics**: Canadian Prime Minister Justin Trudeau has condemned India's actions as "unacceptable" in the dispute over the assassination of a Sikh separatist in British Columbia last year.

**Other News**

* **US Presidential Election**: Third-party candidates are presenting a wild card in battleground states, with at least one candidate on every ballot.
* **NASA**: NASA has launched the Europa Clipper spacecraft to study the habitability of Jupiter's ocean moon.
* **Water Crisis**: England is facing a water crisis, with calls to nationalize the water industry amid sewage spills and rising household bills.

**Opinion Pieces**

* **Reporter's Shield Law**: A reporter's shield law is vital to prevent abuses of power.
* **Inflation**: Some experts believe that more inflation is needed, and that presidents should meddle with the Fed.

Overall, Canada is experiencing a range of news and trends, including diplomatic tensions with India, developments in the insurance industry, and a wide range of concerts and festivals in Toronto.`,
    },
    {
      trend: "Dmart Share Price",
      shortDescription: "Stock market updates for DMart",
      longDescription: `Here is a summary of the information provided about DMart Share Price:

**Summary:**

DMart's share price has been in the news lately due to its recent performance. The company's Q2 revenue growth at 14% YoY was the lowest in a quarter ever, and its same-store sales growth (SSG) was lower than expected. This led to a decline in its share price, with the stock plunging over 9% in early trade. Despite this, the company's revenue from operations grew 22.3% year-on-year to Rs 28,454 crore, while its net profit rose 17.1% to Rs 1,044 crore.

Analysts remain cautious about the company's prospects, citing concerns about the impact of quick commerce on its business. However, the company's management has stated that it is taking steps to improve its sales and revenue growth in the future.

The current share price of Avenue Supermarts Ltd, the parent company of DMart, is around Rs. 4,197.25, with a 1-day change of 0.33% and a 1-year return of 8.83%. The company's market capitalization is Rs. 273,128.91 crores, and the volume of shares traded is 1,222,752.

**Key Points:**

* DMart's Q2 revenue growth at 14% YoY was the lowest in a quarter ever.
* Same-store sales growth (SSG) was lower than expected.
* Share price plunged over 9% in early trade.
* Revenue from operations grew 22.3% year-on-year to Rs 28,454 crore.
* Net profit rose 17.1% to Rs 1,044 crore.
* Analysts remain cautious about the company's prospects due to the impact of quick commerce.
* Company's management is taking steps to improve sales and revenue growth in the future.
* Current share price of Avenue Supermarts Ltd is around Rs. 4,197.25.
* Market capitalization is Rs. 273,128.91 crores.
* Volume of shares traded is 1,222,752.`,
    },
    {
      trend: "Reliance Results",
      shortDescription: "Mixed Q2 results for Reliance Industries",
      longDescription: `Here is a summary of the trend:

**Reliance Industries' Q2 Results**

Reliance Industries (RIL) has released its Q2 results, which have been a mixed bag. The company's revenue has increased by 10% year-on-year (YoY) to ₹2.32 lakh crore, but its net profit has dropped by 4.78% YoY to ₹16,563 crore. The company's digital services segment, which includes its telecom arm Jio, has performed well, with a 23% increase in net profit. However, the company's oil-to-chemicals (O2C) segment has seen a decline in revenue.

The company's stock price has been impacted by the weak Q2 results, with a 1% drop in the share price. Motilal Oswal has cut its target price for RIL shares, citing the weak results. However, CLSA has said that the recent correction in RIL's stock price has brought it closer to its conservative valuation.

Overall, the Q2 results of Reliance Industries have been a mixed bag, with some segments performing well while others have seen a decline. The company's stock price has been impacted by the weak results, but some analysts believe that it is still a good investment opportunity.

**Key Points:**

* RIL's revenue has increased by 10% YoY to ₹2.32 lakh crore
* Net profit has dropped by 4.78% YoY to ₹16.563 crore
* Digital services segment has performed well, with a 23% increase in net profit
* O2C segment has seen a decline in revenue
* Stock price has been impacted by weak Q2 results, with a 1% drop
* Motilal Oswal has cut its target price for RIL shares
* CLSA believes that the recent correction in RIL's stock price has brought it closer to its conservative valuation.`,
    },
    {
      trend: "CET Admit Card 2024",
      shortDescription: "Release details for CET Admit Card 2024",
      longDescription: `Here is a summary of the information provided:

**CET Admit Card 2024 Release**

The Rajasthan CET Admit Card 2024 has been released for the Senior Secondary Level Exam. Candidates can download their admit cards from the official website, [www.rsmssb.rajasthan.gov.in](http://www.rsmssb.rajasthan.gov.in), by entering their application number and date of birth. The exam will be conducted over three days: 22, 23, and 24 October 2024, in two shifts - 9 am to 12 noon and 3 pm to 6 pm. The exam will be conducted for 18,63,082 registered candidates. Candidates are required to carry their admit card along with a valid ID proof to the exam center.

Additionally, the Jharkhand Police Admit Card 2024 is expected to be released soon for the police constable recruitment exam. Candidates can download their admit cards from the official website, [jssc.nic.in](http://jssc.nic.in), by entering their registration number and password.

It's worth noting that the information provided is based on multiple sources, and some of the articles may not be directly related to the CET Admit Card 2024. However, the above summary provides the most relevant and accurate information available.`,
    },
    {
      trend: "Bangalore weather",
      shortDescription: "Weather updates for Bangalore",
      longDescription: `Based on the provided information, here is a summary of the topic "Bangalore weather":

**Bangalore Weather Forecast**

Bangalore is expected to experience a wet week, with heavy rains predicted to persist. The India Meteorological Department (IMD) has forecasted this weather condition. However, the exact dates and details of the weather forecast are not provided in the given content.

Additionally, there is a mention of a weather update affecting flights in Mumbai, but it is not directly related to Bangalore weather.

It's worth noting that the provided content does not contain any detailed information about the current weather conditions in Bangalore, and most of the content is not relevant to the topic. If you could provide more accurate and relevant information, I would be happy to assist you in summarizing it.`,
    },
    {
      trend: "ADHD",
      shortDescription: "Awareness and treatment updates for ADHD",
      longDescription: `Here is a summary of the information provided:

**ADHD Awareness and Treatment Updates**

ADHD is a neurodevelopmental disorder characterized by symptoms of inattention, hyperactivity, and impulsivity. It affects both children and adults, and can impact daily life, relationships, and overall well-being.

Several celebrities, including Alia Bhatt, have spoken publicly about their experiences with ADHD. A recent study found that 3% of schoolchildren exhibit symptoms of both autism and ADHD.

There is no cure for ADHD, but various treatment options are available, including medication, behavioral therapy, and lifestyle changes. Researchers are continually working to better understand the causes and effects of ADHD, and to develop more effective treatments.

**Recent Research Findings:**

* A study published in JAMA Network Open found that combined methylphenidate and selective serotonin reuptake inhibitors (SSRIs) may be an effective treatment option for adults with ADHD and depressive disorder.
* A study found that 3% of schoolchildren exhibit symptoms of both autism and ADHD.

**Public Awareness:**

* Celebrities like Alia Bhatt are speaking out about their experiences with ADHD to raise awareness and reduce stigma around mental health issues.
* Social media platforms like Twitter are being used to share information and personal stories about ADHD, helping to raise awareness and promote understanding.

I hope this summary is helpful! Let me know if you have any further questions or if there's anything else I can help with.`,
    },
    {
      trend: "Nida dar",
      shortDescription: "Performance highlights of Nida Dar in T20 World Cup",
      longDescription: `Here is a summary of the trend:

**Nida Dar and Pakistan's Women's Cricket Team**

Nida Dar, a Pakistani cricketer, has been making headlines in the Women's T20 World Cup. Pakistan's team, led by captain Fatima Sana, has been facing challenges in the tournament, including a heavy loss to New Zealand that knocked them out of the competition. Despite this, Nida Dar has been praised for her performance, including a crucial partnership with Fatima Sana in a match against New Zealand. The team's fielding has been a major concern, with a staggering 8 catches dropped in a single match. Pakistan's campaign in the tournament has been marked by ups and downs, but Nida Dar's bravery and commitment have been notable.`,
    },
    {
      trend: "Salman Khan news",
      shortDescription: "Threats and controversies surrounding Salman Khan",
      longDescription: `Here is a summary of the information provided, focusing on the main points and painting a complete picture:

**Salman Khan's Controversies and Threats**

Salman Khan is in the news due to a controversy surrounding his involvement in a blackbuck poaching case in 1998, which angered the Bishnoi community. Recently, a former Maharashtra minister named Baba Siddique, who was a close friend of Salman Khan, was murdered, and the police suspect that the murder is linked to the feud between Salman Khan and gangster Lawrence Bishnoi.

Lawrence Bishnoi has been seeking revenge against Salman Khan and has a hit list that includes the actor, along with other celebrities, politicians, and rival gang members. Salman Khan was spotted at Baba Siddique's funeral, and the police have warned that anyone who helps Salman Khan will be targeted by the Bishnoi gang.

The Bishnoi gang has been involved in several high-profile cases, including the murder of Siddique, and has a reputation for targeting celebrities and politicians. The police are searching for the third shooter involved in the murder, who has been identified as a gangster from Madhya Pradesh.

In response to the threat, Salman Khan's security has been beefed up by the authorities, with agencies being put on high alert to ensure his safety. The exact details of the security measures are not specified, but it is clear that Salman Khan's safety is a top priority.

Additionally, there are reports about Salman Khan's financial success, including his earnings per film and his net worth. However, these reports are not directly related to the controversy surrounding his involvement in the blackbuck poaching case.

Overall, the situation surrounding Salman Khan is complex and involves a mix of controversy, crime, and celebrity culture. The police are working to ensure his safety, and the public is following the developments closely.`,
    },
  ];
};

export default function IdeaGenerator() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputData, setInputData] = useState({});
  const [contentType, setContentType] = useState("");
  const [selectedTrend, setSelectedTrend] = useState<{ trend: string; shortDescription: string; longDescription: string; } | null>(null);
  const [trends, setTrends] = useState<{ trend: string; shortDescription: string; longDescription: string; }[]>([]);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchTrendsData();
  }, []);

  const fetchTrendsData = async () => {
    setIsFetchingTrends(true);
    try {
      const data = await fetchTrends();
      setTrends(data);
    } catch (error) {
      console.error("Error fetching trends:", error);
      alert("Failed to load trends. Please try again later.");
    } finally {
      setIsFetchingTrends(false);
    }
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    setInputData({});
    setSelectedTrend(null);
    setCharCount(0);
  };

  const handleInputChange = (name: string, value: string) => {
    setInputData((prev) => ({ ...prev, [name]: value }));
    setCharCount(value.length);
  };

  const handleTrendSelect = (value: string) => {
    const selected = trends.find((trend) => trend.trend === value);
    setSelectedTrend(selected || null);
    setInputData({ trend: value });
  };

  const handleGenerateIdeas = () => {
    if (!contentType) {
      alert("Please select a content type.");
      return;
    }

    if (contentType === "trend" && !selectedTrend) {
      alert("Please select a trend.");
      return;
    }

    // Navigate to the ideas generation page
    router.push(
      `/generated-ideas`
    );
  };

  const renderInputField = () => {
    switch (contentType) {
      case "trend":
        return isFetchingTrends ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 animate-spin" /> Loading trends...
          </div>
        ) : (
          <Select onValueChange={handleTrendSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trend" />
            </SelectTrigger>
            <SelectContent>
              {trends.map((trend) => (
                <SelectItem key={trend.trend} value={trend.trend}>
                  {trend.trend} - {trend.shortDescription}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "blog":
      case "news_article":
      case "product_image":
      case "youtube_video":
      case "website":
        return (
          <Input
            placeholder="Enter URL"
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="w-full"
          />
        );
      case "instagram_post":
      case "tweet":
      case "linkedin_post":
      case "reel":
      case "text_prompt":
      case "hashtag":
        return (
          <>
            <Textarea
              placeholder="Enter your content (Max 300 characters)"
              onChange={(e) => handleInputChange("content", e.target.value)}
              maxLength={300}
              className="w-full"
            />
            <p className="text-right text-xs text-gray-500">
              {charCount}/300 characters
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex flex-col w-56 bg-white shadow-lg p-6">
          <Link href="/" className="text-3xl font-bold text-grey-900 mb-8">
            Zyke
          </Link>
        </aside>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Button
            className="fixed top-4 left-4 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" className="text-3xl font-bold text-indigo-600">
                    Zyke
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/chatbot"
                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-100"
                      >
                        <MessageCircle className="w-6 h-6 mr-3" />
                        Chatbot
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ideas"
                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-100"
                      >
                        <Sparkles className="w-6 h-6 mr-3" />
                        Ideas
                      </Link>
                    </li>
                  </ul>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-30">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              What do you want to design today?
            </h1>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {contentTypes.map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 md:p-4 bg-white shadow-lg rounded-lg transition ${
                  contentType === value
                    ? "border-2 border-indigo-500"
                    : "border border-transparent"
                }`}
                onClick={() => handleContentTypeChange(value)}
              >
                <Icon className="w-12 h-12 mb-4 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {label}
                </h3>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {contentTypeDescriptions[value as keyof typeof contentTypeDescriptions]}
                </p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {contentType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-8 bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {contentType === "trend"
                        ? "Select a Trend"
                        : "Enter Details"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderInputField()}
                    {selectedTrend && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Trend Description:
                        </h3>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className="text-gray-700"
                        >
                          {selectedTrend.longDescription}
                        </ReactMarkdown>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <Button
                    onClick={handleGenerateIdeas}
                    className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Ideas
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </TooltipProvider>
  );
}
