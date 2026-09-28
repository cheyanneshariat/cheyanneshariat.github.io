---
layout: site
title: "Sitemap"
permalink: /sitemap/
sitemap: false
---

{% assign pages = site.pages | where_exp: "p", "p.title" | where_exp: "p", "p.sitemap != false" | sort: "title" %}
<ul>
{% for p in pages %}<li><a href="{{ p.url | relative_url }}">{{ p.title }}</a></li>
{% endfor %}</ul>
