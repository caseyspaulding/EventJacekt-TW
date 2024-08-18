import { config, Config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local'
    },
    collections: {
        authors: collection({
            label: 'Authors',
            slugField: 'name',
            path: 'content/authors/*',
            format: { contentField: 'content' },
            schema: {
                name: fields.slug({ name: { label: 'Name' } }),
                content: fields.markdoc({ label: 'Content' }),
                avatar: fields.image({
                    label: 'Avatar',
                    directory: 'public/images/authors',
                    publicPath: '/images/authors/'
                })
            }
        }),
        posts: collection({
            label: 'Posts',
            slugField: 'title',
            path: 'content/posts/*',
            format: { contentField: 'content' },
            schema: {
                avatar: fields.image({
                    label: 'Avatar',
                    directory: 'public/images/avatars',
                    publicPath: '/images/avatars/'
                }),
                title: fields.slug({ name: { label: 'Title' } }),
                content: fields.markdoc({
                    label: 'Content'
                }),
                datePosted: fields.date({ label: 'Date Posted' }),
                image: fields.image({
                    label: 'Featured Image',
                    directory: 'public/images/posts',
                    publicPath: '/images/posts/'
                })
            }
        })
    }
});
