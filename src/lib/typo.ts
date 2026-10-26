/** Espaces insécables de la typographie française : avant ? ! : ; » et après «. */
export const fr = (t?: string | null): string => (t ?? '').replace(/ +([?!:;»])/g, ' $1').replace(/« +/g, '« ')
