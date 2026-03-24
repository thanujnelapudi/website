import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'song',
  title: 'Song',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (Telugu)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleTransliterated',
      title: 'Title (English Transliteration)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'titleTransliterated',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ministry',
      title: 'Ministry',
      type: 'reference',
      to: {type: 'ministry'},
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      to: {type: 'artist'},
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chords',
      title: 'Chords',
      type: 'text',
    }),
    defineField({
      name: 'bibleVerses',
      title: 'Bible Verses',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'occasion',
      title: 'Occasion',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Sunday Worship', value: 'sunday-worship'},
          {title: 'Christmas', value: 'christmas'},
          {title: 'Easter', value: 'easter'},
          {title: 'Good Friday', value: 'good-friday'},
          {title: 'New Year', value: 'new-year'},
          {title: 'Wedding', value: 'wedding'},
          {title: 'Communion', value: 'communion'},
          {title: 'Funeral', value: 'funeral'},
          {title: 'Children', value: 'children'},
          {title: 'Youth', value: 'youth'},
        ],
      },
    }),
    defineField({
      name: 'mood',
      title: 'Mood',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Praise', value: 'praise'},
          {title: 'Worship', value: 'worship'},
          {title: 'Thanksgiving', value: 'thanksgiving'},
          {title: 'Prayer', value: 'prayer'},
          {title: 'Devotional', value: 'devotional'},
          {title: 'Comfort', value: 'comfort'},
          {title: 'Joyful', value: 'joyful'},
          {title: 'Reflective', value: 'reflective'},
          {title: 'Victory', value: 'victory'},
        ],
      },
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      options: {
        list: [
          {title: 'Traditional', value: 'traditional'},
          {title: 'Contemporary', value: 'contemporary'},
          {title: 'Modern', value: 'modern'},
        ],
      },
      initialValue: 'contemporary'
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Song',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'titleTransliterated',
    },
  },
})
