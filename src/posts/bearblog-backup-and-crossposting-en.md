---
layout: post.njk
title: Bearblog Backup and Crossposting (EN)
date: 2026-06-23
permalink: /posts/bearblog-backup-and-crossposting-en/
tags:
  - inteligencia-artificial
  - produtividade
meta_description: How I used Claude to create automations for backing up and
  distributing content from my blog, even though I had never programmed before.
---
I've always been passionate about technology and productivity. I follow new developments, test methodologies, and like understanding how things work under the hood. But programming was never my territory.  

Until recently, I would have said without hesitation that automation and programming languages were things for other people, not for a lawyer like me. I decided to test that using Claude, and the result surprised me, I managed to create two functional scripts, without ever having written a line of code before.  

1. <a href='https://github.com/rcapitao/bearblog-backup' target='_blank'>Bearblog Backup</a>
2. <a href='https://github.com/rcapitao/bearblog-crossposting' target='_blank'>Bearblog Crossposting</a>

The first one does a daily backup of the posts from my blog hosted on <a href='https://bearblog.dev' target='_blank'>Bearblog</a>, reading the Atom feed, saving everything in markdown, and downloading the images automatically. The second one handles crossposting, meaning that whenever I publish something new, it distributes the content to my social networks <a href='https://mastodon.social/@rcapitao' target='_blank'>Mastodon</a> and <a href='https://bsky.app/profile/rcapitao.com' target='_blank'>Bluesky</a>, reading my blog's RSS feed.  

Both scripts are running, hosted on Github, and are already part of my routine. I keep adjusting and adding configurations as the need arises.  

What struck me most in this process wasn't the automation itself, but the feeling of autonomy. AI didn't replace my reasoning, it expanded what I was already able to do. And that changes how I look at any new tool, including in my work with privacy and data.  

I documented everything, from the execution to how to adapt it for other blogs on <a href='https://bearblog.dev' target='_blank'>Bearblog</a>, in case anyone wants to take advantage of it.