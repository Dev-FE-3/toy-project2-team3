// 전역 이벤트 위치 관리자
// 이벤트 ID에 대해 고유한 위치(트랙) 번호를 할당하고 유지

/**
 * 이벤트 위치 관리 클래스
 * 캘린더의 각 이벤트에 고유한 세로 위치(트랙)를 할당하여
 * 연속된 날짜에서도 일관된 위치를 유지하도록 관리합니다.
 */
class EventPositionManager {
  // 이벤트 ID -> 위치 번호 매핑
  private positionMap: Map<string, number> = new Map();
  // 다음에 할당할 위치 번호
  private positionCounter: number = 0;

  /**
   * 이벤트 ID에 대한 위치 반환 (없으면 새로 할당)
   * @param eventId 이벤트 ID
   * @returns 할당된 위치 번호
   */
  getPosition(eventId: string): number {
    if (!this.positionMap.has(eventId)) {
      this.positionMap.set(eventId, this.positionCounter++);
    }
    return this.positionMap.get(eventId) || 0;
  }

  /**
   * 현재 할당된 총 위치 수 반환
   * @returns 총 위치 수
   */
  getTotalPositions(): number {
    return this.positionCounter;
  }

  /**
   * 모든 위치 정보 초기화
   */
  reset(): void {
    this.positionMap.clear();
    this.positionCounter = 0;
  }

  /**
   * 여러 이벤트에 한번에 위치 할당
   * @param events 이벤트 객체 배열 (각 객체는 id 속성을 가져야 함)
   */
  assignPositionsToEvents(events: { id?: string }[]): void {
    // 먼저 기존 ID가 있는 이벤트에 위치 할당
    events
      .filter((event) => !!event.id)
      .forEach((event) => {
        if (event.id) this.getPosition(event.id);
      });

    // ID가 없는 이벤트는 임시 ID 생성하여 처리
    events
      .filter((event) => !event.id)
      .forEach((event, index) => {
        const tempId = `temp-${index}`;
        this.getPosition(tempId);
      });
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const eventPositionManager = new EventPositionManager();
