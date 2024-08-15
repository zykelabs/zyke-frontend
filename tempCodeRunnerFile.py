if (use != 'img-gen'):
            return Response(stream_with_context(generate(model, use)), mimetype='text/event-stream')
        else:
            return get_images()