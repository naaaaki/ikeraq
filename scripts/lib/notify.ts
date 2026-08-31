/**
 * Discord 通知（SPEC §11-7 / §17.2）
 *
 * 「気づかないまま止まっているのが最悪」なので、失敗は必ず通知する。
 * 通知自体の失敗でパイプラインを止めてはいけない。
 */

export type NotifyLevel = 'info' | 'warn' | 'error';

const COLORS: Record<NotifyLevel, number> = {
  info: 0x2ecc71,
  warn: 0xf1c40f,
  error: 0xe74c3c,
};

const PREFIX: Record<NotifyLevel, string> = {
  info: '✅',
  warn: '⚠️',
  error: '⛔',
};

export async function notify(
  level: NotifyLevel,
  title: string,
  lines: string[] = []
): Promise<void> {
  const message = `${PREFIX[level]} ${title}\n${lines.join('\n')}`;
  console.log(`[notify:${level}] ${message}`);

  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    console.warn('[notify] DISCORD_WEBHOOK_URL が未設定のため送信をスキップします');
    return;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Ikeraq',
        embeds: [
          {
            title: `${PREFIX[level]} ${title}`,
            description: lines.join('\n').slice(0, 3800) || undefined,
            color: COLORS[level],
          },
        ],
      }),
    });
    if (!res.ok) {
      console.warn(`[notify] Discord への送信に失敗: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    // 通知の失敗でパイプラインを止めない
    console.warn('[notify] Discord への送信で例外', e);
  }
}
