interface OffsetProps {
  mode: "offset";
  total: number;
  limit: number;
  offset: number;
  next?: string | null;
  prev?: string | null;
  onPageChange: (newOffset: number) => void;
}

interface CursorProps {
  mode: "cursor";
  after: string | null;
  before: string | null;
  onPageChange: (after?: string, before?: string) => void;
}

type Props = OffsetProps | CursorProps;

export default function Pagination(props: Props) {
  if (props.mode === "offset") {
    const { total, limit, offset, next, prev, onPageChange } = props;

    const nextPage = () => onPageChange(offset + limit);
    const prevPage = () => onPageChange(offset - limit);

    if (total <= limit) return;

    return (
      <nav className="w-full flex justify-center gap-4">
        {prev && (
          <button className="cursor-pointer" onClick={() => prevPage()}>
            prev
          </button>
        )}

        {next && (
          <button className="cursor-pointer" onClick={() => nextPage()}>
            next
          </button>
        )}
      </nav>
    );
  }

  if (props.mode === "cursor") {
    const { after, before, onPageChange } = props;

    return (
      <nav className="w-full flex justify-center gap-4">
        {before && (
          <button
            className="cursor-pointer"
            onClick={() => onPageChange(undefined, before)} // ✅
          >
            prev
          </button>
        )}

        <span>Cursors</span>

        {after && (
          <button
            className="cursor-pointer"
            onClick={() => onPageChange(after, undefined)} // ✅
          >
            next
          </button>
        )}
      </nav>
    );
  }

  return null;
}
