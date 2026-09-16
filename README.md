# QUL Study Plus

学習に必要な機能を1つにまとめる、QULの学習支援プラットフォーム。
このリポジトリは **完全新規プロジェクト** として、指示書のPhase 1「最重要フロー」を
実データ(モックなし)で動かすことを目標にスキャフォールドしたものです。

## 実装済み(Phase 1コア)

- Supabase Authによるログイン(`/login`)、ロール(student/teacher/admin)に応じたルーティング制御
- 生徒ホーム(`/`): 今日の授業・宿題・live授業への入室ボタン
- 授業一覧(`/classes`)、授業詳細(`/lessons/[id]`)
- **授業ルーム(`/lessons/[id]/room`)**: 入室記録(`lesson_members`)、資料のリアルタイム受信、課題の閲覧・提出
- 先生ダッシュボード(`/teacher`): 今日の授業、授業開始ボタン(`scheduled → live`)
- **先生の授業ダッシュボード(`/teacher/lessons/[id]/live`)**: 参加者一覧(リアルタイム)、資料配信(Supabase Storageアップロード)、課題配信、提出BOX(リアルタイム反映・返却・再提出依頼)、授業終了(`live → ended`)
- 予約(`/reservations`): 予約枠一覧・予約(定員チェック・二重予約防止)
- DBスキーマ全体(`supabase/migrations/0001_init.sql`)とRLSポリシー(生徒/先生/管理者の権限分離)
- Supabase Realtime publication設定、Storage bucket + ポリシー

## 未実装 / Phase 2・3のスタブ

以下は指示書のPhase 2・3にあたり、テーブル定義のみ用意し、UIは「Phase 2で実装予定」の表示に留めています。「見た目だけ完成」を避けるため、あえてモックのUIは作っていません。

- マイボード / みんなのボード / コメント / リアクション
- 勉強時間タイマー・学習レポート・宿題管理・目標管理のUI(テーブルとRLSのみ用意済み)
- LIVEモニターの詳細な回答状況表示
- 画面共有(WebRTC)
- Admin画面一式
- 通知の配信ロジック(テーブルのみ)

## セットアップ手順

1. **新しいSupabaseプロジェクトを作成**し、Settings > API から URL と anon key を取得
2. `.env.local.example` を `.env.local` にコピーし、値を設定
3. Supabase CLIでマイグレーションを適用
   ```bash
   npx supabase link --project-ref <PROJECT_REF>
   npx supabase db push
   ```
   (または `supabase/migrations/0001_init.sql` の内容をSQL Editorで直接実行)
4. 型を再生成(手書きの簡易型から置き換え)
   ```bash
   npx supabase gen types typescript --project-id <PROJECT_ID> > src/lib/supabase/types.ts
   ```
5. 依存関係をインストールして起動
   ```bash
   npm install
   npm run dev
   ```
6. Supabase Authで先生・生徒のテストユーザーを作成し、`profiles`テーブルに `role` を設定
7. `classes` / `class_members` / `lessons` にテストデータを投入し、Phase 1の一連の流れ(授業開始→入室→資料配信→課題提出→確認)を確認

## 新規プロジェクトとしての位置づけ

指示書では開発着手前に既存のGitHubリポジトリ・Supabaseプロジェクトを確認する手順が定められていますが、
今回は「完全新規プロジェクト」との回答をもとに、新規リポジトリ・新規Supabaseプロジェクトを前提に構築しています。
他のQULサービスと同じSupabaseプロジェクトに相乗りさせる場合は、テーブル名・Storage bucket名の衝突がないか
事前に必ず確認してください。
