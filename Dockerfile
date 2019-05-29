from node:8.16-alpine

copy ./kart-summary.js .
ENTRYPOINT [ "./kart-summary.js" ]
CMD ["file"]