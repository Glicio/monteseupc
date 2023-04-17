

export default function dateIsoStringToString(value: string) {
    const date = new Date(value);
    return date.toLocaleDateString('pt-BR');
}
